package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;

import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.model.enums.EOrderType;

import vn.edu.ut.resto.service.OrderService;
import vn.edu.ut.resto.service.WaiterService;

import java.util.EnumSet;


@Service
public class WaiterServiceImpl
        implements WaiterService {


    @Autowired
    private OrderService orderService;


    @Override
    public Order createDineInOrder(
            CreateOrderRequest request
    ) {

        if (
                request.getOrderType()
                        != EOrderType.DINE_IN
        ) {

            throw new InvalidOperationException(
                    "Phục vụ chỉ được tạo đơn tại bàn."
            );
        }


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
    public Order serveItem(
            Long orderItemId
    ) {

        return orderService
                .serveOrderItem(
                        orderItemId,

                        EnumSet.of(
                                EOrderType.DINE_IN
                        )
                );
    }
}