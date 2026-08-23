package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.enums.EOrderStatus;

import java.util.Collection;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    /*
     * Kiểm tra một bàn có đang tồn tại
     * Order chưa hoàn tất hay không.
     */
    boolean existsByTable_IdAndStatusIn(
            Long tableId,
            Collection<EOrderStatus> statuses
    );


    /*
     * Lấy Order đang hoạt động của một bàn.
     *
     * Fetch luôn những dữ liệu cần thiết
     * để OrderMapper tạo response.
     */
    @EntityGraph(
            attributePaths = {
                    "table",
                    "user",
                    "orderItems",
                    "orderItems.product"
            }
    )
    Optional<Order>
    findFirstByTable_IdAndStatusInOrderByCreatedAtDesc(
            Long tableId,
            Collection<EOrderStatus> statuses
    );
}