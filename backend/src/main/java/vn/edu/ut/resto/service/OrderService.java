package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.model.KitchenTicket;
import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.model.enums.EOrderType;

import java.util.Collection;
import java.util.List;


public interface OrderService {


    Order createOrder(
            CreateOrderRequest request
    );


    Order getActiveOrderByTable(
            Long tableId
    );


    List<Order> getActiveOrdersByType(
            EOrderType orderType
    );


    Order addItemsToDineInOrder(
            Long orderId,
            AddOrderItemsRequest request
    );


    Order serveOrderItem(
            Long orderItemId,

            Collection<EOrderType>
                    allowedOrderTypes
    );


    /*
     * Dùng cho Payment sau này.
     *
     * TAKE_AWAY / DELIVERY:
     *
     * payment SUCCESS
     * ->
     * Order PENDING
     * ->
     * fireUnfiredItemsToKitchen()
     */
    KitchenTicket fireUnfiredItemsToKitchen(
            Long orderId
    );

    Order requestPayment(
            Long orderId
    );
}