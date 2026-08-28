package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.ut.resto.model.OrderItem;

import vn.edu.ut.resto.model.enums.EOrderItemStatus;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {


    // ==================================================
    // FIND ITEM DETAILS
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.table",
                    "order.user",
                    "product",
                    "kitchenTicket"
            }
    )
    Optional<OrderItem>
    findWithDetailsById(
            Long id
    );


    // ==================================================
    // UNFIRED ITEMS
    //
    // Dùng sau này cho:
    // TAKE_AWAY / DELIVERY
    // payment SUCCESS.
    // ==================================================

    List<OrderItem>
    findByOrder_IdAndKitchenTicketIsNull(
            Long orderId
    );


    // ==================================================
    // TICKET:
    // còn món chưa hoàn thành bếp?
    //
    // allowedFinishedStatuses:
    // READY / SERVED
    // ==================================================

    boolean
    existsByKitchenTicket_IdAndStatusNotIn(
            Long kitchenTicketId,

            Collection<EOrderItemStatus>
                    finishedStatuses
    );


    // ==================================================
    // TICKET:
    // còn món chưa SERVED?
    // ==================================================

    boolean
    existsByKitchenTicket_IdAndStatusNot(
            Long kitchenTicketId,

            EOrderItemStatus status
    );


    // ==================================================
    // ORDER:
    // còn món chưa SERVED?
    // ==================================================

    boolean existsByOrder_IdAndStatusNot(
            Long orderId,

            EOrderItemStatus status
    );
}