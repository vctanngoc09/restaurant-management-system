package vn.edu.ut.resto.repository;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import vn.edu.ut.resto.model.Order;

import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.EOrderType;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


public interface OrderRepository
        extends JpaRepository<Order, Long> {


    // ==================================================
    // ACTIVE ORDER OF TABLE
    // ==================================================

    boolean existsByTable_IdAndStatusIn(
            Long tableId,
            Collection<EOrderStatus> statuses
    );


    // ==================================================
    // FIND ACTIVE BY TABLE
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "table",
                    "user",
                    "orderItems",
                    "orderItems.product",
                    "orderItems.kitchenTicket",
                    "shippingDetail"
            }
    )
    Optional<Order>
    findFirstByTable_IdAndStatusInOrderByCreatedAtDesc(
            Long tableId,

            Collection<EOrderStatus> statuses
    );


    // ==================================================
    // ORDER DETAILS
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "table",
                    "user",
                    "orderItems",
                    "orderItems.product",
                    "orderItems.kitchenTicket",
                    "shippingDetail"
            }
    )
    @Query("""
            SELECT o
            FROM Order o
            WHERE o.id = :orderId
            """)
    Optional<Order>
    findByIdWithDetails(
            @Param("orderId")
            Long orderId
    );


    // ==================================================
    // ORDER DETAILS + DATABASE LOCK
    //
    // Dùng khi gọi thêm món để tránh
    // 2 request đồng thời tạo cùng batchNumber.
    // ==================================================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(
            attributePaths = {
                    "table",
                    "user",
                    "orderItems",
                    "orderItems.product",
                    "orderItems.kitchenTicket",
                    "shippingDetail"
            }
    )
    @Query("""
            SELECT o
            FROM Order o
            WHERE o.id = :orderId
            """)
    Optional<Order>
    findByIdForUpdate(
            @Param("orderId")
            Long orderId
    );


    // ==================================================
    // ACTIVE BY ORDER TYPE
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "table",
                    "user",
                    "orderItems",
                    "orderItems.product",
                    "orderItems.kitchenTicket",
                    "shippingDetail"
            }
    )
    List<Order>
    findByOrderTypeAndStatusInOrderByCreatedAtDesc(
            EOrderType orderType,

            Collection<EOrderStatus> statuses
    );
}