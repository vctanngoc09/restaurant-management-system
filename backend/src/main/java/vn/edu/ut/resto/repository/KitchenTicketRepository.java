package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.edu.ut.resto.model.KitchenTicket;

import vn.edu.ut.resto.model.enums.EKitchenTicketStatus;

import java.util.List;
import java.util.Optional;


public interface KitchenTicketRepository
        extends JpaRepository<KitchenTicket, Long> {


    // ==================================================
    // WAITING
    //
    // FIFO:
    // firedAt ASC
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.table",
                    "order.user",
                    "items",
                    "items.product"
            }
    )
    List<KitchenTicket>
    findByStatusOrderByFiredAtAscIdAsc(
            EKitchenTicketStatus status
    );


    // ==================================================
    // PROCESSING
    //
    // Đơn được bắt đầu lâu nhất ở trên.
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.table",
                    "order.user",
                    "items",
                    "items.product"
            }
    )
    List<KitchenTicket>
    findByStatusOrderByStartedAtAscIdAsc(
            EKitchenTicketStatus status
    );


    // ==================================================
    // READY
    //
    // Batch đã xong lâu nhất
    // cần được lấy trước.
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.table",
                    "order.user",
                    "items",
                    "items.product"
            }
    )
    List<KitchenTicket>
    findByStatusOrderByReadyAtAscIdAsc(
            EKitchenTicketStatus status
    );


    // ==================================================
    // FIND DETAILS
    // ==================================================

    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.table",
                    "order.user",
                    "items",
                    "items.product"
            }
    )
    Optional<KitchenTicket>
    findWithDetailsById(
            Long id
    );


    // ==================================================
    // CURRENT MAX BATCH
    // ==================================================

    @Query("""
            SELECT COALESCE(MAX(kt.batchNumber), 0)
            FROM KitchenTicket kt
            WHERE kt.order.id = :orderId
            """)
    Integer findMaxBatchNumberByOrderId(
            @Param("orderId")
            Long orderId
    );
}