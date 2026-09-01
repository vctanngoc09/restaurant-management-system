package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CashPaymentRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.dto.response.PaymentReceiptResponse;
import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.model.enums.EOrderType;

import java.util.List;


public interface CashierService {

    Order createOrder(
            CreateOrderRequest request
    );

    Order getActiveOrderByTable(
            Long tableId
    );


    Order addItems(
            Long orderId,
            AddOrderItemsRequest request
    );


    List<Order> getActiveOrdersByType(
            EOrderType orderType
    );


    Order serveItem(
            Long orderItemId
    );

    Order requestPayment(
            Long orderId
    );

    PaymentReceiptResponse payCash(
            Long orderId,
            CashPaymentRequest request
    );
}