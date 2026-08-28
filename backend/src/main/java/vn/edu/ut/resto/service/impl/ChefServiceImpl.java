package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.model.KitchenTicket;
import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;

import vn.edu.ut.resto.model.enums.EKitchenTicketStatus;
import vn.edu.ut.resto.model.enums.EOrderItemStatus;
import vn.edu.ut.resto.model.enums.EOrderStatus;

import vn.edu.ut.resto.repository.KitchenTicketRepository;
import vn.edu.ut.resto.repository.OrderItemRepository;
import vn.edu.ut.resto.repository.OrderRepository;

import vn.edu.ut.resto.service.ChefService;

import java.time.LocalDateTime;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;


@Service
public class ChefServiceImpl
        implements ChefService {


    /*
     * Với bếp:
     *
     * READY hoặc SERVED
     * đều nghĩa là món đó
     * đã hoàn tất chế biến.
     */
    private static final Set<EOrderItemStatus>
            KITCHEN_FINISHED_STATUSES =
            EnumSet.of(
                    EOrderItemStatus.READY,
                    EOrderItemStatus.SERVED
            );


    @Autowired
    private KitchenTicketRepository
            kitchenTicketRepository;


    @Autowired
    private OrderItemRepository
            orderItemRepository;


    @Autowired
    private OrderRepository orderRepository;


    // ==================================================
    // WAITING
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public List<KitchenTicket>
    getWaitingTickets() {

        return kitchenTicketRepository
                .findByStatusOrderByFiredAtAscIdAsc(
                        EKitchenTicketStatus.WAITING
                );
    }


    // ==================================================
    // PROCESSING
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public List<KitchenTicket>
    getProcessingTickets() {

        return kitchenTicketRepository
                .findByStatusOrderByStartedAtAscIdAsc(
                        EKitchenTicketStatus.PROCESSING
                );
    }


    // ==================================================
    // READY
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public List<KitchenTicket>
    getReadyTickets() {

        return kitchenTicketRepository
                .findByStatusOrderByReadyAtAscIdAsc(
                        EKitchenTicketStatus.READY
                );
    }


    // ==================================================
    // START TICKET
    //
    // WAITING -> PROCESSING
    // ==================================================

    @Override
    @Transactional
    public KitchenTicket startTicket(
            Long ticketId
    ) {

        KitchenTicket ticket =
                kitchenTicketRepository
                        .findWithDetailsById(
                                ticketId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy phiếu bếp có ID: "
                                                + ticketId
                                )
                        );


        if (
                ticket.getStatus()
                        == EKitchenTicketStatus.PROCESSING
        ) {

            return ticket;
        }


        if (
                ticket.getStatus()
                        != EKitchenTicketStatus.WAITING
        ) {

            throw new InvalidOperationException(
                    "Chỉ phiếu WAITING mới có thể bắt đầu chế biến."
            );
        }


        Order order =
                ticket.getOrder();


        if (order == null) {

            throw new InvalidOperationException(
                    "Phiếu bếp không thuộc đơn hàng nào."
            );
        }


        // ==================================================
        // PAYMENT GUARD
        // ==================================================

        if (
                order.getStatus()
                        == EOrderStatus.AWAITING_PAYMENT
        ) {

            throw new InvalidOperationException(
                    "Đơn hàng chưa thanh toán, bếp không được phép chế biến."
            );
        }


        if (
                order.getStatus()
                        == EOrderStatus.COMPLETED
                        ||
                        order.getStatus()
                                == EOrderStatus.CANCELLED
        ) {

            throw new InvalidOperationException(
                    "Đơn hàng đã kết thúc."
            );
        }


        // ==================================================
        // TICKET
        // ==================================================

        ticket.setStatus(
                EKitchenTicketStatus.PROCESSING
        );


        ticket.setStartedAt(
                LocalDateTime.now()
        );


        // ==================================================
        // ORDER
        //
        // First ticket:
        // PENDING -> PROCESSING
        //
        // Add-on ticket:
        // PROCESSING -> PROCESSING
        // ==================================================

        if (
                order.getStatus()
                        == EOrderStatus.PENDING
        ) {

            order.setStatus(
                    EOrderStatus.PROCESSING
            );


            orderRepository.save(
                    order
            );
        }


        return kitchenTicketRepository
                .save(
                        ticket
                );
    }


    // ==================================================
    // ITEM STATUS
    // ==================================================

    @Override
    @Transactional
    public KitchenTicket updateItemStatus(
            Long orderItemId,
            EOrderItemStatus targetStatus
    ) {

        OrderItem item =
                orderItemRepository
                        .findWithDetailsById(
                                orderItemId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy món trong đơn có ID: "
                                                + orderItemId
                                )
                        );


        KitchenTicket ticket =
                item.getKitchenTicket();


        if (ticket == null) {

            throw new InvalidOperationException(
                    "Món này chưa được gửi xuống bếp."
            );
        }


        if (
                ticket.getStatus()
                        != EKitchenTicketStatus.PROCESSING
        ) {

            throw new InvalidOperationException(
                    "Phiếu bếp phải PROCESSING trước khi cập nhật món."
            );
        }


        if (
                targetStatus
                        != EOrderItemStatus.COOKING
                        &&
                        targetStatus
                                != EOrderItemStatus.READY
        ) {

            throw new InvalidOperationException(
                    "Bếp chỉ được chuyển món sang COOKING hoặc READY."
            );
        }


        EOrderItemStatus currentStatus =
                item.getStatus();


        // ==================================================
        // PENDING -> COOKING
        // ==================================================

        if (
                currentStatus
                        == EOrderItemStatus.PENDING
        ) {

            if (
                    targetStatus
                            != EOrderItemStatus.COOKING
            ) {

                throw new InvalidOperationException(
                        "Món PENDING chỉ có thể chuyển sang COOKING."
                );
            }


            item.setStatus(
                    EOrderItemStatus.COOKING
            );
        }


        // ==================================================
        // COOKING -> READY
        // ==================================================

        else if (
                currentStatus
                        == EOrderItemStatus.COOKING
        ) {

            if (
                    targetStatus
                            != EOrderItemStatus.READY
            ) {

                throw new InvalidOperationException(
                        "Món COOKING chỉ có thể chuyển sang READY."
                );
            }


            item.setStatus(
                    EOrderItemStatus.READY
            );
        }


        // ==================================================
        // READY
        // ==================================================

        else if (
                currentStatus
                        == EOrderItemStatus.READY
        ) {

            throw new InvalidOperationException(
                    "Món đã READY và đang chờ phục vụ."
            );
        }


        // ==================================================
        // SERVED
        // ==================================================

        else {

            throw new InvalidOperationException(
                    "Món đã được phục vụ, bếp không thể cập nhật."
            );
        }


        orderItemRepository.save(
                item
        );


        // ==================================================
        // TICKET ALL KITCHEN FINISHED?
        //
        // READY hoặc SERVED
        // ==================================================

        boolean hasUnfinishedItem =
                orderItemRepository
                        .existsByKitchenTicket_IdAndStatusNotIn(
                                ticket.getId(),
                                KITCHEN_FINISHED_STATUSES
                        );


        if (!hasUnfinishedItem) {

            ticket.setStatus(
                    EKitchenTicketStatus.READY
            );


            ticket.setReadyAt(
                    LocalDateTime.now()
            );


            kitchenTicketRepository.save(
                    ticket
            );
        }


        return kitchenTicketRepository
                .findWithDetailsById(
                        ticket.getId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy phiếu bếp."
                        )
                );
    }
}