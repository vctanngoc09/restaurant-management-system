package vn.edu.ut.resto.service;

import vn.edu.ut.resto.model.KitchenTicket;

import vn.edu.ut.resto.model.enums.EOrderItemStatus;

import java.util.List;


public interface ChefService {


    List<KitchenTicket> getWaitingTickets();


    List<KitchenTicket> getProcessingTickets();


    List<KitchenTicket> getReadyTickets();


    KitchenTicket startTicket(
            Long ticketId
    );


    KitchenTicket updateItemStatus(
            Long orderItemId,

            EOrderItemStatus targetStatus
    );

    KitchenTicket completeTicket(
            Long ticketId
    );
}