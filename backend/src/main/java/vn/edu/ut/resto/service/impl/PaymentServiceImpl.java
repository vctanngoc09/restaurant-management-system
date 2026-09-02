package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.dto.request.CashPaymentRequest;

import vn.edu.ut.resto.dto.response.PaymentReceiptResponse;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;
import vn.edu.ut.resto.exception.UnauthorizedException;

import vn.edu.ut.resto.mapper.PaymentMapper;

import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.Payment;
import vn.edu.ut.resto.model.Promotion;
import vn.edu.ut.resto.model.RestaurantSetting;
import vn.edu.ut.resto.model.RestaurantTable;

import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.EOrderType;
import vn.edu.ut.resto.model.enums.EPaymentStatus;
import vn.edu.ut.resto.model.enums.ETableStatus;

import vn.edu.ut.resto.repository.OrderRepository;
import vn.edu.ut.resto.repository.PaymentRepository;
import vn.edu.ut.resto.repository.PromotionRepository;
import vn.edu.ut.resto.repository.RestaurantSettingRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;

import vn.edu.ut.resto.service.OrderService;
import vn.edu.ut.resto.service.PaymentService;
import vn.edu.ut.resto.service.PromotionService;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.UUID;


@Service
public class PaymentServiceImpl
        implements PaymentService {


    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private PaymentRepository paymentRepository;


    @Autowired
    private RestaurantSettingRepository
            restaurantSettingRepository;


    @Autowired
    private PromotionRepository promotionRepository;


    @Autowired
    private RestaurantTableRepository tableRepository;


    @Autowired
    private PromotionService promotionService;


    @Autowired
    private OrderService orderService;


    @Autowired
    private PaymentMapper paymentMapper;


    // ==================================================
    // CASH PAYMENT
    // ==================================================

    @Override
    @Transactional
    public PaymentReceiptResponse payCash(
            Long orderId,
            CashPaymentRequest request
    ) {

        // ==================================================
        // FIND ORDER + LOCK
        //
        // Tránh 2 request payment cùng lúc.
        // ==================================================

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy đơn hàng có ID: "
                                                + orderId
                                )
                        );


        // ==================================================
        // ORDER MUST WAIT PAYMENT
        // ==================================================

        if (
                order.getStatus()
                        != EOrderStatus.AWAITING_PAYMENT
        ) {

            throw new InvalidOperationException(
                    "Chỉ đơn đang chờ thanh toán mới có thể thực hiện thanh toán."
            );
        }


        // ==================================================
        // PREVENT DOUBLE PAYMENT
        // ==================================================

        boolean alreadyPaid =
                paymentRepository
                        .existsByOrder_IdAndPaymentStatus(
                                order.getId(),
                                EPaymentStatus.SUCCESS
                        );


        if (alreadyPaid) {

            throw new InvalidOperationException(
                    "Đơn hàng này đã được thanh toán thành công."
            );
        }


        // ==================================================
        // RESTAURANT SETTING
        // ==================================================

        RestaurantSetting setting =
                restaurantSettingRepository
                        .findFirstByOrderByIdAsc()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Nhà hàng chưa được cấu hình."
                                )
                        );


        // ==================================================
        // SUBTOTAL
        //
        // KHÔNG sửa Order.
        //
        // Lấy trực tiếp:
        // Order.totalPrice
        // ==================================================

        if (order.getTotalPrice() == null || order.getTotalPrice() < 0) {
            throw new InvalidOperationException(
                    "Tổng tiền đơn hàng không hợp lệ."
            );
        }


        BigDecimal subtotal =
                BigDecimal
                        .valueOf(
                                order.getTotalPrice()
                        )
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        // ==================================================
        // PROMOTION
        // ==================================================

        Promotion promotion =
                null;


        BigDecimal discountAmount =
                BigDecimal.ZERO
                        .setScale(2);


        String promotionCode =
                normalizeCode(
                        request.getPromotionCode()
                );


        if (promotionCode != null) {

            /*
             * PromotionService hiện tại đã kiểm tra:
             *
             * - code tồn tại
             * - active
             * - thời gian
             * - usage limit
             * - min order
             */

            promotion =
                    promotionService
                            .getValidPromotion(
                                    promotionCode,
                                    subtotal
                            );


            discountAmount =
                    promotionService
                            .calculateDiscount(
                                    promotion,
                                    subtotal
                            )
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );
        }


        // ==================================================
        // TAXABLE AMOUNT
        //
        // subtotal - discount
        // ==================================================

        BigDecimal taxableAmount =
                subtotal
                        .subtract(
                                discountAmount
                        )
                        .max(
                                BigDecimal.ZERO
                        )
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        // ==================================================
        // VAT RATE
        // ==================================================

        BigDecimal vatRate =
                setting.getVatRate() != null
                        ? setting.getVatRate()
                        : BigDecimal.ZERO;


        // ==================================================
        // VAT AMOUNT
        //
        // taxableAmount * vatRate / 100
        // ==================================================

        BigDecimal vatAmount =
                taxableAmount
                        .multiply(
                                vatRate
                        )
                        .divide(
                                BigDecimal.valueOf(100),
                                2,
                                RoundingMode.HALF_UP
                        );


        // ==================================================
        // FINAL AMOUNT
        //
        // subtotal
        // - discount
        // + VAT
        // ==================================================

        BigDecimal amount =
                taxableAmount
                        .add(
                                vatAmount
                        )
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        // ==================================================
        // CASH RECEIVED
        // ==================================================

        BigDecimal cashReceived =
                request
                        .getCashReceived()
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        if (
                cashReceived.compareTo(
                        amount
                ) < 0
        ) {

            throw new InvalidOperationException(
                    "Số tiền khách đưa không đủ. "
                            + "Cần thanh toán: "
                            + amount
                            + " VND."
            );
        }


        // ==================================================
        // CHANGE
        // ==================================================

        BigDecimal changeAmount =
                cashReceived
                        .subtract(
                                amount
                        )
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        // ==================================================
        // CURRENT CASHIER
        // ==================================================

        String cashierName =
                getCurrentCashierName();


        // ==================================================
        // CREATE PAYMENT
        // ==================================================

        Payment payment =
                paymentMapper
                        .toCashPayment(
                                order,
                                promotion,
                                subtotal,
                                discountAmount,
                                vatRate,
                                vatAmount,
                                amount,
                                cashReceived,
                                changeAmount,
                                cashierName
                        );


        // ==================================================
        // CASH TRANSACTION ID
        // ==================================================

        payment.setTransactionId(
                generateCashTransactionId()
        );


        // ==================================================
        // SAVE PAYMENT
        //
        // CASH:
        // SUCCESS ngay lập tức.
        // ==================================================

        Payment savedPayment =
                paymentRepository
                        .save(
                                payment
                        );


        // ==================================================
        // PROMOTION USED COUNT
        //
        // Chỉ tăng sau khi payment SUCCESS.
        // ==================================================

        if (promotion != null) {

            int currentUsedCount =
                    promotion.getUsedCount() != null
                            ? promotion.getUsedCount()
                            : 0;


            promotion.setUsedCount(
                    currentUsedCount + 1
            );


            promotionRepository.save(
                    promotion
            );
        }


        // ==================================================
        // ORDER AFTER PAYMENT
        // ==================================================

        if (
                order.getOrderType()
                        == EOrderType.DINE_IN
        ) {

            // ==================================================
            // DINE IN
            //
            // Món đã phục vụ hết trước đó.
            //
            // AWAITING_PAYMENT
            // ->
            // COMPLETED
            // ==================================================

            order.setStatus(
                    EOrderStatus.COMPLETED
            );


            // ==================================================
            // RELEASE TABLE
            // ==================================================

            RestaurantTable table =
                    order.getTable();


            if (table == null) {

                throw new InvalidOperationException(
                        "Đơn tại bàn không có thông tin bàn."
                );
            }


            table.setStatus(
                    ETableStatus.AVAILABLE
            );


            tableRepository.save(
                    table
            );

        } else {

            // ==================================================
            // TAKE AWAY / DELIVERY
            //
            // Thanh toán trước.
            //
            // AWAITING_PAYMENT
            // ->
            // PENDING
            //
            // Sau đó mới gửi xuống bếp.
            // ==================================================

            order.setStatus(
                    EOrderStatus.PENDING
            );
        }


        // ==================================================
        // FLUSH ORDER STATUS
        // ==================================================

        orderRepository.flush();


        // ==================================================
        // SEND TAKE AWAY / DELIVERY TO KITCHEN
        // ==================================================

        if (
                order.getOrderType()
                        == EOrderType.TAKE_AWAY
                        ||
                        order.getOrderType()
                                == EOrderType.DELIVERY
        ) {

            orderService
                    .fireUnfiredItemsToKitchen(
                            order.getId()
                    );
        }


        // ==================================================
        // RECEIPT RESPONSE
        // ==================================================

        return paymentMapper
                .toReceiptResponse(
                        savedPayment,
                        setting
                );
    }


    // ==================================================
    // CURRENT CASHIER
    // ==================================================

    private String getCurrentCashierName() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication == null
                        ||
                        !authentication.isAuthenticated()
                        ||
                        "anonymousUser".equals(
                                authentication.getPrincipal()
                        )
        ) {

            throw new UnauthorizedException(
                    "Không xác định được thu ngân đang đăng nhập."
            );
        }


        return authentication
                .getName();
    }


    // ==================================================
    // CASH TRANSACTION ID
    // ==================================================

    private String generateCashTransactionId() {

        return "CASH-"
                +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .toUpperCase();
    }


    // ==================================================
    // NORMALIZE PROMOTION CODE
    // ==================================================

    private String normalizeCode(
            String value
    ) {

        if (
                value == null
                        ||
                        value.isBlank()
        ) {

            return null;
        }


        return value
                .trim()
                .toUpperCase();
    }

    // ==================================================
// GET RECEIPT
//
// Dùng để:
// - in lại hóa đơn
// - refresh trang vẫn in được
// - không phụ thuộc sessionStorage FE
// ==================================================

    @Override
    @Transactional(readOnly = true)
    public PaymentReceiptResponse getReceipt(
            Long orderId
    ) {

        // ==================================================
        // SUCCESS PAYMENT
        //
        // Chỉ Payment SUCCESS mới được xem là
        // hóa đơn đã thanh toán.
        // ==================================================

        Payment payment =
                paymentRepository
                        .findByOrder_IdAndPaymentStatus(
                                orderId,
                                EPaymentStatus.SUCCESS
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy hóa đơn đã thanh toán của đơn hàng có ID: "
                                                + orderId
                                )
                        );


        // ==================================================
        // RESTAURANT SETTING
        // ==================================================

        RestaurantSetting setting =
                restaurantSettingRepository
                        .findFirstByOrderByIdAsc()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Nhà hàng chưa được cấu hình."
                                )
                        );


        // ==================================================
        // RECEIPT RESPONSE
        //
        // Không tính lại:
        // subtotal
        // discount
        // VAT
        // total
        //
        // Các giá trị đó lấy từ Payment snapshot.
        // ==================================================

        return paymentMapper
                .toReceiptResponse(
                        payment,
                        setting
                );
    }
}