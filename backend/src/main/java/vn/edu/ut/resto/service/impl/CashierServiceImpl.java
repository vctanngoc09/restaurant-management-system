package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CashPaymentRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.dto.response.PaymentReceiptResponse;
import vn.edu.ut.resto.exception.InvalidOperationException;

import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.model.enums.EOrderType;

import vn.edu.ut.resto.service.CashierService;
import vn.edu.ut.resto.service.OrderService;
import vn.edu.ut.resto.service.PaymentService;

import java.util.EnumSet;
import java.util.List;


@Service
public class CashierServiceImpl
        implements CashierService {


    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;


    @Override
    public Order createOrder(
            CreateOrderRequest request
    ) {

        return orderService
                .createOrder(
                        request
                );
    }

    @Override
    public Order getActiveOrderByTable(
            Long tableId
    ) {

        return orderService
                .getActiveOrderByTable(
                        tableId
                );
    }


    @Override
    public Order addItems(
            Long orderId,
            AddOrderItemsRequest request
    ) {

        return orderService
                .addItemsToDineInOrder(
                        orderId,
                        request
                );
    }


    @Override
    public List<Order> getActiveOrdersByType(
            EOrderType orderType
    ) {
        if (
                orderType
                        != EOrderType.TAKE_AWAY
                        &&
                        orderType
                                != EOrderType.DELIVERY
        ) {

            throw new InvalidOperationException(
                    "API này chỉ dùng để lấy đơn mang về hoặc giao hàng."
            );
        }


        return orderService
                .getActiveOrdersByType(
                        orderType
                );
    }

    @Override
    public Order requestPayment(
            Long orderId
    ) {

        return orderService
                .requestPayment(
                        orderId
                );
    }

    @Override
    public Order serveItem(
            Long orderItemId
    ) {

        return orderService
                .serveOrderItem(
                        orderItemId,

                        EnumSet.of(
                                EOrderType.DINE_IN,
                                EOrderType.TAKE_AWAY,
                                EOrderType.DELIVERY
                        )
                );
    }


    @Override
    public PaymentReceiptResponse payCash(
            Long orderId,
            CashPaymentRequest request
    ) {

        return paymentService
                .payCash(
                        orderId,
                        request
                );
    }
}