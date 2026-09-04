package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.resto.dto.request.VietQrPaymentRequest;
import vn.edu.ut.resto.dto.response.VietQrPaymentResponse;
import vn.edu.ut.resto.dto.response.VietQrPaymentStatusResponse;
import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;
import vn.edu.ut.resto.exception.UnauthorizedException;
import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.Payment;
import vn.edu.ut.resto.model.Promotion;
import vn.edu.ut.resto.model.RestaurantSetting;
import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.EOrderType;
import vn.edu.ut.resto.model.enums.EPaymentMethod;
import vn.edu.ut.resto.model.enums.EPaymentStatus;
import vn.edu.ut.resto.model.enums.ETableStatus;
import vn.edu.ut.resto.repository.OrderRepository;
import vn.edu.ut.resto.repository.PaymentRepository;
import vn.edu.ut.resto.repository.PromotionRepository;
import vn.edu.ut.resto.repository.RestaurantSettingRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;
import vn.edu.ut.resto.service.OrderService;
import vn.edu.ut.resto.service.PromotionService;
import vn.payos.PayOS;
import vn.payos.exception.PayOSException;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.v2.paymentRequests.PaymentLinkStatus;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Objects;

@Service
public class PayOSPaymentService {
    private final PayOS payOS;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final RestaurantSettingRepository restaurantSettingRepository;
    private final PromotionRepository promotionRepository;
    private final RestaurantTableRepository tableRepository;
    private final PromotionService promotionService;
    private final OrderService orderService;

    @Value("${payos.return-url:http://localhost:5173/cashier}")
    private String returnUrl;

    @Value("${payos.cancel-url:http://localhost:5173/cashier}")
    private String cancelUrl;

    @Value("${payos.expire-seconds:600}")
    private long expireSeconds;

    public PayOSPaymentService(
            PayOS payOS,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            RestaurantSettingRepository restaurantSettingRepository,
            PromotionRepository promotionRepository,
            RestaurantTableRepository tableRepository,
            PromotionService promotionService,
            OrderService orderService) {
        this.payOS = payOS;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.restaurantSettingRepository = restaurantSettingRepository;
        this.promotionRepository = promotionRepository;
        this.tableRepository = tableRepository;
        this.promotionService = promotionService;
        this.orderService = orderService;
    }

    @Transactional
    public VietQrPaymentResponse createVietQr(Long orderId, VietQrPaymentRequest request) {
        Order order = getOrderForPayment(orderId);
        ensureAwaitingPayment(order);
        ensureNotPaid(orderId);

        String promotionCode = normalizeCode(request != null ? request.getPromotionCode() : null);
        Pricing pricing = calculatePricing(order, promotionCode);

        Payment pending = paymentRepository
                .findFirstByOrder_IdAndPaymentMethodAndPaymentStatusOrderByIdDesc(
                        orderId, EPaymentMethod.VIETQR, EPaymentStatus.PENDING)
                .orElse(null);

        if (pending != null) {
            syncPendingPayment(pending);

            if (pending.getPaymentStatus() == EPaymentStatus.SUCCESS) {
                return toCreateResponse(pending);
            }

            if (pending.getPaymentStatus() == EPaymentStatus.PENDING
                    && Objects.equals(normalizeCode(pending.getPromotionCode()), promotionCode)
                    && pending.getAmount().compareTo(pricing.amount) == 0) {
                return toCreateResponse(pending);
            }

            if (pending.getPaymentStatus() == EPaymentStatus.PENDING) {
                cancelPendingPayment(pending, "Tao ma VietQR moi");
            }
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setSubtotal(pricing.subtotal);
        payment.setPromotion(pricing.promotion);
        payment.setPromotionCode(pricing.promotion != null ? pricing.promotion.getCode() : null);
        payment.setDiscountAmount(pricing.discountAmount);
        payment.setVatRate(pricing.vatRate);
        payment.setVatAmount(pricing.vatAmount);
        payment.setAmount(pricing.amount);
        payment.setPaymentMethod(EPaymentMethod.VIETQR);
        payment.setPaymentStatus(EPaymentStatus.PENDING);
        payment.setCashierName(getCurrentCashierName());

        payment = paymentRepository.saveAndFlush(payment);
        payment.setPayosOrderCode(payment.getId());

        long expiredAt = Instant.now().plusSeconds(Math.max(expireSeconds, 60)).getEpochSecond();
        CreatePaymentLinkRequest payOSRequest = CreatePaymentLinkRequest.builder()
                .orderCode(payment.getPayosOrderCode())
                .amount(pricing.amount.longValueExact())
                .description("RESTO " + order.getId())
                .returnUrl(returnUrl)
                .cancelUrl(cancelUrl)
                .expiredAt(expiredAt)
                .build();

        try {
            CreatePaymentLinkResponse result = payOS.paymentRequests().create(payOSRequest);
            payment.setPayosPaymentLinkId(result.getPaymentLinkId());
            payment.setCheckoutUrl(result.getCheckoutUrl());
            payment.setQrCode(result.getQrCode());
            payment.setExpiresAt(toLocalDateTime(result.getExpiredAt() != null ? result.getExpiredAt() : expiredAt));
            payment.setFailureReason(null);
            paymentRepository.save(payment);
            return toCreateResponse(payment);
        } catch (PayOSException error) {
            throw new InvalidOperationException("Không thể tạo mã VietQR từ PayOS: " + error.getMessage());
        }
    }

    @Transactional
    public VietQrPaymentStatusResponse getVietQrStatus(Long orderId) {
        Payment payment = paymentRepository
                .findFirstByOrder_IdAndPaymentMethodOrderByIdDesc(orderId, EPaymentMethod.VIETQR)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy giao dịch VietQR của đơn hàng có ID: " + orderId));

        if (payment.getPaymentStatus() == EPaymentStatus.PENDING) {
            syncPendingPayment(payment);
        }

        return toStatusResponse(payment);
    }

    /**
     * Trước khi nhận CASH, phải chắc chắn QR cũ không còn khả năng được thanh toán.
     * Nếu PayOS đã PAID hoặc UNDERPAID thì chặn CASH để tránh thu tiền hai lần.
     */
    @Transactional
    public void cancelPendingForCash(Long orderId) {
        Payment pending = paymentRepository
                .findFirstByOrder_IdAndPaymentMethodAndPaymentStatusOrderByIdDesc(
                        orderId, EPaymentMethod.VIETQR, EPaymentStatus.PENDING)
                .orElse(null);

        if (pending == null) {
            return;
        }

        if (pending.getPayosOrderCode() == null) {
            pending.setPaymentStatus(EPaymentStatus.FAILED);
            pending.setFailureReason("Giao dịch VietQR thiếu PayOS orderCode.");
            paymentRepository.save(pending);
            return;
        }

        try {
            PaymentLink current = payOS.paymentRequests().get(pending.getPayosOrderCode());

            if (current.getStatus() == PaymentLinkStatus.PAID) {
                throw new InvalidOperationException(
                        "VietQR của đơn này đã được thanh toán. Không thể nhận thêm tiền mặt.");
            }

            if (current.getStatus() == PaymentLinkStatus.UNDERPAID) {
                throw new InvalidOperationException(
                        "VietQR của đơn này đã nhận một phần tiền. Không thể tự động chuyển sang tiền mặt.");
            }

            if (isPendingProviderStatus(current.getStatus())) {
                PaymentLink cancelled = payOS.paymentRequests().cancel(
                        pending.getPayosOrderCode(), "Khach chuyen sang thanh toan tien mat");

                if (cancelled.getStatus() == PaymentLinkStatus.PAID) {
                    throw new InvalidOperationException(
                            "VietQR vừa được thanh toán. Không thể nhận thêm tiền mặt.");
                }

                if (cancelled.getStatus() == PaymentLinkStatus.UNDERPAID
                        || isPendingProviderStatus(cancelled.getStatus())) {
                    throw new InvalidOperationException(
                            "Chưa thể xác nhận hủy VietQR cũ. Vui lòng kiểm tra lại trước khi nhận tiền mặt.");
                }

                applyTerminalStatus(pending, cancelled.getStatus());
                return;
            }

            applyTerminalStatus(pending, current.getStatus());
        } catch (InvalidOperationException error) {
            throw error;
        } catch (PayOSException error) {
            throw new InvalidOperationException(
                    "Không thể kiểm tra/hủy VietQR cũ trên PayOS. Tạm thời chưa thể nhận tiền mặt: "
                            + error.getMessage());
        }
    }

    @Transactional
    public void handleWebhook(Webhook webhook) {
        try {
            WebhookData data = payOS.webhooks().verify(webhook);
            if (data == null || data.getOrderCode() == null) {
                return;
            }

            Payment payment = paymentRepository.findByPayosOrderCode(data.getOrderCode()).orElse(null);
            if (payment == null) {
                return;
            }

            if (payment.getPaymentStatus() == EPaymentStatus.SUCCESS) {
                enrichTransactionData(payment, data);
                paymentRepository.save(payment);
                return;
            }

            if (payment.getPaymentStatus() != EPaymentStatus.PENDING) {
                return;
            }

            PaymentLink current = payOS.paymentRequests().get(data.getOrderCode());
            applyProviderStatus(payment, current.getStatus(), data);
        } catch (PayOSException error) {
            throw new InvalidOperationException("Webhook PayOS không hợp lệ: " + error.getMessage());
        }
    }

    private void syncPendingPayment(Payment payment) {
        if (payment.getPayosOrderCode() == null) {
            payment.setPaymentStatus(EPaymentStatus.FAILED);
            payment.setFailureReason("Giao dịch VietQR thiếu PayOS orderCode.");
            paymentRepository.save(payment);
            return;
        }

        try {
            PaymentLink current = payOS.paymentRequests().get(payment.getPayosOrderCode());
            applyProviderStatus(payment, current.getStatus(), null);
        } catch (PayOSException error) {
            throw new InvalidOperationException("Không thể kiểm tra trạng thái PayOS: " + error.getMessage());
        }
    }

    private void cancelPendingPayment(Payment payment, String reason) {
        if (payment.getPayosOrderCode() == null) {
            payment.setPaymentStatus(EPaymentStatus.FAILED);
            payment.setFailureReason("Giao dịch VietQR thiếu PayOS orderCode.");
            paymentRepository.save(payment);
            return;
        }

        try {
            PaymentLink current = payOS.paymentRequests().get(payment.getPayosOrderCode());

            if (current.getStatus() == PaymentLinkStatus.PAID) {
                finalizeSuccess(payment, null);
                return;
            }

            if (current.getStatus() == PaymentLinkStatus.UNDERPAID) {
                throw new InvalidOperationException(
                        "Giao dịch VietQR đã nhận một phần tiền, không thể tạo mã khác tự động.");
            }

            if (isPendingProviderStatus(current.getStatus())) {
                PaymentLink cancelled = payOS.paymentRequests().cancel(payment.getPayosOrderCode(), reason);
                if (cancelled.getStatus() == PaymentLinkStatus.PAID) {
                    finalizeSuccess(payment, null);
                    return;
                }
                if (cancelled.getStatus() == PaymentLinkStatus.UNDERPAID
                        || isPendingProviderStatus(cancelled.getStatus())) {
                    throw new InvalidOperationException("Không thể hủy mã VietQR cũ trên PayOS.");
                }
                applyTerminalStatus(payment, cancelled.getStatus());
                return;
            }

            applyTerminalStatus(payment, current.getStatus());
        } catch (InvalidOperationException error) {
            throw error;
        } catch (PayOSException error) {
            throw new InvalidOperationException("Không thể hủy mã VietQR cũ: " + error.getMessage());
        }
    }

    private void applyProviderStatus(Payment payment, PaymentLinkStatus status, WebhookData webhookData) {
        if (status == PaymentLinkStatus.PAID) {
            finalizeSuccess(payment, webhookData);
            return;
        }

        if (status == PaymentLinkStatus.UNDERPAID) {
            payment.setPaymentStatus(EPaymentStatus.PENDING);
            payment.setFailureReason("PayOS đang báo UNDERPAID - đã nhận một phần tiền.");
            paymentRepository.save(payment);
            return;
        }

        if (isPendingProviderStatus(status)) {
            payment.setPaymentStatus(EPaymentStatus.PENDING);
            payment.setFailureReason(null);
            paymentRepository.save(payment);
            return;
        }

        applyTerminalStatus(payment, status);
    }

    private void applyTerminalStatus(Payment payment, PaymentLinkStatus status) {
        if (status == PaymentLinkStatus.CANCELLED) {
            payment.setPaymentStatus(EPaymentStatus.CANCELLED);
        } else if (status == PaymentLinkStatus.EXPIRED) {
            payment.setPaymentStatus(EPaymentStatus.EXPIRED);
        } else if (status == PaymentLinkStatus.FAILED) {
            payment.setPaymentStatus(EPaymentStatus.FAILED);
        } else {
            payment.setPaymentStatus(EPaymentStatus.PENDING);
        }

        payment.setFailureReason(status == null ? null : "PayOS: " + status.name());
        paymentRepository.save(payment);
    }

    private boolean isPendingProviderStatus(PaymentLinkStatus status) {
        return status == PaymentLinkStatus.PENDING || status == PaymentLinkStatus.PROCESSING;
    }

    private Payment finalizeSuccess(Payment source, WebhookData webhookData) {
        Payment payment = paymentRepository.findByIdForUpdate(source.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy giao dịch VietQR có ID: " + source.getId()));

        if (payment.getPaymentStatus() == EPaymentStatus.SUCCESS) {
            return payment;
        }

        Order order = orderRepository.findByIdForUpdate(payment.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy đơn hàng có ID: " + payment.getOrder().getId()));

        if (paymentRepository.existsByOrder_IdAndPaymentStatus(order.getId(), EPaymentStatus.SUCCESS)) {
            throw new InvalidOperationException(
                    "Đơn hàng đã có một giao dịch thanh toán thành công khác.");
        }

        if (order.getStatus() != EOrderStatus.AWAITING_PAYMENT) {
            throw new InvalidOperationException(
                    "Đơn hàng không còn ở trạng thái chờ thanh toán để hoàn tất VietQR.");
        }

        payment.setPaymentStatus(EPaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        payment.setFailureReason(null);

        if (webhookData != null) {
            enrichTransactionData(payment, webhookData);
        }

        Promotion promotion = payment.getPromotion();
        if (promotion != null) {
            int usedCount = promotion.getUsedCount() != null ? promotion.getUsedCount() : 0;
            promotion.setUsedCount(usedCount + 1);
            promotionRepository.save(promotion);
        }

        if (order.getOrderType() == EOrderType.DINE_IN) {
            order.setStatus(EOrderStatus.COMPLETED);
            RestaurantTable table = order.getTable();
            if (table == null) {
                throw new InvalidOperationException("Đơn tại bàn không có thông tin bàn.");
            }
            table.setStatus(ETableStatus.AVAILABLE);
            tableRepository.save(table);
        } else {
            order.setStatus(EOrderStatus.PENDING);
        }

        paymentRepository.save(payment);
        orderRepository.flush();

        if (order.getOrderType() == EOrderType.TAKE_AWAY
                || order.getOrderType() == EOrderType.DELIVERY) {
            orderService.fireUnfiredItemsToKitchen(order.getId());
        }

        return payment;
    }

    private void enrichTransactionData(Payment payment, WebhookData data) {
        if (data.getReference() != null && !data.getReference().isBlank()) {
            payment.setReference(data.getReference());
            if (payment.getTransactionId() == null || payment.getTransactionId().isBlank()) {
                payment.setTransactionId(data.getReference());
            }
        }
        if (data.getCounterAccountBankId() != null && !data.getCounterAccountBankId().isBlank()) {
            payment.setBankCode(data.getCounterAccountBankId());
        }
    }

    private Order getOrderForPayment(Long orderId) {
        return orderRepository.findByIdForUpdate(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy đơn hàng có ID: " + orderId));
    }

    private void ensureAwaitingPayment(Order order) {
        if (order.getStatus() != EOrderStatus.AWAITING_PAYMENT) {
            throw new InvalidOperationException(
                    "Chỉ đơn đang chờ thanh toán mới có thể tạo VietQR.");
        }
    }

    private void ensureNotPaid(Long orderId) {
        if (paymentRepository.existsByOrder_IdAndPaymentStatus(orderId, EPaymentStatus.SUCCESS)) {
            throw new InvalidOperationException("Đơn hàng này đã được thanh toán thành công.");
        }
    }

    private Pricing calculatePricing(Order order, String promotionCode) {
        RestaurantSetting setting = restaurantSettingRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResourceNotFoundException("Nhà hàng chưa được cấu hình."));

        if (order.getTotalPrice() == null || order.getTotalPrice() < 0) {
            throw new InvalidOperationException("Tổng tiền đơn hàng không hợp lệ.");
        }

        BigDecimal subtotal = BigDecimal.valueOf(order.getTotalPrice()).setScale(0, RoundingMode.HALF_UP);
        Promotion promotion = null;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (promotionCode != null) {
            promotion = promotionService.getValidPromotion(promotionCode, subtotal);
            discountAmount = promotionService.calculateDiscount(promotion, subtotal)
                    .setScale(0, RoundingMode.HALF_UP);
        }

        BigDecimal taxableAmount = subtotal.subtract(discountAmount)
                .max(BigDecimal.ZERO).setScale(0, RoundingMode.HALF_UP);
        BigDecimal vatRate = setting.getVatRate() != null ? setting.getVatRate() : BigDecimal.ZERO;
        BigDecimal vatAmount = taxableAmount.multiply(vatRate)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        BigDecimal amount = taxableAmount.add(vatAmount).setScale(0, RoundingMode.HALF_UP);

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Số tiền thanh toán VietQR phải lớn hơn 0 VND.");
        }

        return new Pricing(subtotal, promotion, discountAmount, vatRate, vatAmount, amount);
    }

    private VietQrPaymentResponse toCreateResponse(Payment payment) {
        return new VietQrPaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPayosOrderCode(),
                payment.getPayosPaymentLinkId(),
                payment.getAmount(),
                payment.getPaymentStatus(),
                payment.getCheckoutUrl(),
                payment.getQrCode(),
                payment.getExpiresAt(),
                payment.getFailureReason());
    }

    private VietQrPaymentStatusResponse toStatusResponse(Payment payment) {
        return new VietQrPaymentStatusResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPayosOrderCode(),
                payment.getPaymentStatus(),
                payment.getAmount(),
                payment.getPaidAt(),
                payment.getExpiresAt(),
                payment.getFailureReason());
    }

    private LocalDateTime toLocalDateTime(Long epochSeconds) {
        if (epochSeconds == null) {
            return null;
        }
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSeconds), ZoneId.systemDefault());
    }

    private String normalizeCode(String value) {
        return value == null || value.isBlank() ? null : value.trim().toUpperCase();
    }

    private String getCurrentCashierName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Không xác định được thu ngân đang đăng nhập.");
        }
        return authentication.getName();
    }

    private static class Pricing {
        private final BigDecimal subtotal;
        private final Promotion promotion;
        private final BigDecimal discountAmount;
        private final BigDecimal vatRate;
        private final BigDecimal vatAmount;
        private final BigDecimal amount;

        private Pricing(BigDecimal subtotal, Promotion promotion, BigDecimal discountAmount,
                        BigDecimal vatRate, BigDecimal vatAmount, BigDecimal amount) {
            this.subtotal = subtotal;
            this.promotion = promotion;
            this.discountAmount = discountAmount;
            this.vatRate = vatRate;
            this.vatAmount = vatAmount;
            this.amount = amount;
        }
    }
}
