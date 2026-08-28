package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.response.KitchenTicketResponse;
import vn.edu.ut.resto.dto.response.OrderItemResponse;

import vn.edu.ut.resto.model.KitchenTicket;
import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;

import java.util.List;


@Component
public class KitchenTicketMapper {


    public KitchenTicketResponse toResponse(
            KitchenTicket ticket
    ) {

        KitchenTicketResponse response =
                new KitchenTicketResponse();


        response.setId(
                ticket.getId()
        );


        response.setBatchNumber(
                ticket.getBatchNumber()
        );


        response.setStatus(
                ticket.getStatus()
        );


        response.setFiredAt(
                ticket.getFiredAt()
        );


        response.setStartedAt(
                ticket.getStartedAt()
        );


        response.setReadyAt(
                ticket.getReadyAt()
        );


        response.setDoneAt(
                ticket.getDoneAt()
        );


        // ==================================================
        // ORDER
        // ==================================================

        Order order =
                ticket.getOrder();


        if (order != null) {

            response.setOrderId(
                    order.getId()
            );


            response.setOrderType(
                    order.getOrderType()
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
        }


        // ==================================================
        // ITEMS
        // ==================================================

        if (ticket.getItems() != null) {

            List<OrderItemResponse> items =
                    ticket.getItems()
                            .stream()
                            .map(
                                    this::toItemResponse
                            )
                            .toList();


            response.setItems(
                    items
            );

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