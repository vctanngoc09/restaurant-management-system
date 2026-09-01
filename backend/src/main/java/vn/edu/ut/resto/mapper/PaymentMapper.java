package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.response.PaymentReceiptItemResponse;
import vn.edu.ut.resto.dto.response.PaymentReceiptResponse;
import vn.edu.ut.resto.dto.response.ReceiptRestaurantResponse;

import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;
import vn.edu.ut.resto.model.Payment;
import vn.edu.ut.resto.model.Promotion;
import vn.edu.ut.resto.model.RestaurantSetting;

import vn.edu.ut.resto.model.enums.EPaymentMethod;
import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Component
public class PaymentMapper {


    // ==================================================
    // CASH PAYMENT ENTITY
    // ==================================================

    public Payment toCashPayment(
            Order order,
            Promotion promotion,
            BigDecimal subtotal,
            BigDecimal discountAmount,
            BigDecimal vatRate,
            BigDecimal vatAmount,
            BigDecimal amount,
            BigDecimal cashReceived,
            BigDecimal changeAmount,
            String cashierName
    ) {

        Payment payment =
                new Payment();


        payment.setOrder(
                order
        );


        payment.setSubtotal(
                subtotal
        );


        payment.setPromotion(
                promotion
        );


        payment.setPromotionCode(
                promotion != null
                        ? promotion.getCode()
                        : null
        );


        payment.setDiscountAmount(
                discountAmount
        );


        payment.setVatRate(
                vatRate
        );


        payment.setVatAmount(
                vatAmount
        );


        payment.setAmount(
                amount
        );


        payment.setPaymentMethod(
                EPaymentMethod.CASH
        );


        payment.setPaymentStatus(
                EPaymentStatus.SUCCESS
        );


        payment.setCashReceived(
                cashReceived
        );


        payment.setChangeAmount(
                changeAmount
        );


        payment.setCashierName(
                cashierName
        );


        payment.setPaidAt(
                LocalDateTime.now()
        );


        return payment;
    }


    // ==================================================
    // RECEIPT RESPONSE
    // ==================================================

    public PaymentReceiptResponse toReceiptResponse(
            Payment payment,
            RestaurantSetting setting
    ) {

        if (
                payment == null
                        ||
                        payment.getOrder() == null
        ) {

            return null;
        }


        Order order =
                payment.getOrder();


        // ==================================================
        // RESTAURANT
        // ==================================================

        ReceiptRestaurantResponse restaurant =
                new ReceiptRestaurantResponse(
                        setting.getName(),
                        setting.getPhone(),
                        setting.getAddress(),
                        setting.getTaxCode(),
                        setting.getLogoUrl(),
                        setting.getCurrency()
                );


        // ==================================================
        // ITEMS
        // ==================================================

        Map<String, PaymentReceiptItemResponse> groupedItems =
                new LinkedHashMap<>();


        for (OrderItem item : order.getOrderItems()) {

            Long productId =
                    item.getProduct().getId();


            BigDecimal unitPrice =
                    BigDecimal
                            .valueOf(item.getPrice())
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );


            String key =
                    productId
                            + "_"
                            + unitPrice.toPlainString();


            PaymentReceiptItemResponse existing =
                    groupedItems.get(key);


            if (existing == null) {

                BigDecimal lineTotal =
                        unitPrice
                                .multiply(
                                        BigDecimal.valueOf(
                                                item.getQuantity()
                                        )
                                );


                groupedItems.put(
                        key,
                        new PaymentReceiptItemResponse(
                                productId,
                                item.getProduct().getName(),
                                unitPrice,
                                item.getQuantity(),
                                lineTotal
                        )
                );

            } else {

                int newQuantity =
                        existing.getQuantity()
                                + item.getQuantity();


                BigDecimal newLineTotal =
                        unitPrice
                                .multiply(
                                        BigDecimal.valueOf(
                                                newQuantity
                                        )
                                );


                groupedItems.put(
                        key,
                        new PaymentReceiptItemResponse(
                                productId,
                                existing.getProductName(),
                                unitPrice,
                                newQuantity,
                                newLineTotal
                        )
                );
            }
        }


        List<PaymentReceiptItemResponse> items =
                new ArrayList<>(
                        groupedItems.values()
                );


        // ==================================================
        // TABLE
        // ==================================================

        String tableNumber =
                order.getTable() != null
                        ? order.getTable()
                        .getTableNumber()
                        : null;


        // ==================================================
        // RECEIPT CODE
        // ==================================================

        String receiptCode =
                String.format(
                        "HD%06d",
                        payment.getId()
                );


        // ==================================================
        // RESPONSE
        // ==================================================

        return new PaymentReceiptResponse(
                payment.getId(),
                receiptCode,

                order.getId(),
                order.getOrderType(),
                tableNumber,

                payment.getCashierName(),

                payment.getPaidAt(),

                payment.getPaymentMethod(),
                payment.getPaymentStatus(),

                restaurant,

                items,

                payment.getSubtotal(),
                payment.getPromotionCode(),
                payment.getDiscountAmount(),

                payment.getVatRate(),
                payment.getVatAmount(),

                payment.getAmount(),

                payment.getCashReceived(),
                payment.getChangeAmount()
        );
    }
}