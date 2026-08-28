package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.model.Order;


public interface WaiterService {


    Order createDineInOrder(
            CreateOrderRequest request
    );


    Order getActiveOrderByTable(
            Long tableId
    );


    Order addItems(
            Long orderId,
            AddOrderItemsRequest request
    );


    Order serveItem(
            Long orderItemId
    );
}