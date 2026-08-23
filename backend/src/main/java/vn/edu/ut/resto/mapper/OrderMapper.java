package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.CreateOrderRequest;

import vn.edu.ut.resto.dto.response.OrderItemResponse;
import vn.edu.ut.resto.dto.response.OrderResponse;

import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;

import java.util.List;

@Component
public class OrderMapper {

    public Order toEntity(
            CreateOrderRequest request
    ) {

        Order order = new Order();

        order.setOrderType(
                request.getOrderType()
        );

        order.setNote(
                request.getNote()
        );

        return order;
    }


    public OrderResponse toResponse(
            Order order
    ) {

        OrderResponse response =
                new OrderResponse();


        response.setId(
                order.getId()
        );

        response.setCreatedAt(
                order.getCreatedAt()
        );

        response.setOrderType(
                order.getOrderType()
        );

        response.setStatus(
                order.getStatus()
        );

        response.setNote(
                order.getNote()
        );

        response.setTotalPrice(
                order.getTotalPrice()
        );

        if (order.getTable() != null) {

            response.setTableId(
                    order.getTable()
                            .getId()
            );

            response.setTableNumber(
                    order.getTable()
                            .getTableNumber()
            );
        }

        if (order.getUser() != null) {

            response.setStaffId(
                    order.getUser()
                            .getId()
            );

            response.setStaffName(
                    order.getUser()
                            .getFullName()
            );
        }

        if (order.getOrderItems() != null) {

            List<OrderItemResponse> items =
                    order.getOrderItems()
                            .stream()
                            .map(
                                    this::toItemResponse
                            )
                            .toList();

            response.setItems(items);

        } else {

            response.setItems(
                    List.of()
            );
        }


        return response;
    }

    private OrderItemResponse toItemResponse(
            OrderItem item
    ) {

        OrderItemResponse response =
                new OrderItemResponse();


        response.setId(
                item.getId()
        );

        response.setPrice(
                item.getPrice()
        );

        response.setQuantity(
                item.getQuantity()
        );

        response.setNote(
                item.getNote()
        );

        response.setStatus(
                item.getStatus()
        );


        response.setLineTotal(
                item.getPrice()
                        * item.getQuantity()
        );


        if (item.getProduct() != null) {

            response.setProductId(
                    item.getProduct()
                            .getId()
            );

            response.setProductName(
                    item.getProduct()
                            .getName()
            );
        }


        return response;
    }
}