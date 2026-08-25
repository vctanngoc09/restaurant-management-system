package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;
import vn.edu.ut.resto.model.Order;

public interface OrderService {

    Order createOrder(
            CreateOrderRequest request
    );

    Order getActiveOrderByTable(
            Long tableId
    );

    Order addItemsToOrder(
            Long orderId,
            AddOrderItemsRequest request
    );
}