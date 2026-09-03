package vn.edu.ut.resto.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.ut.resto.model.Payment;
import vn.edu.ut.resto.model.enums.EPaymentMethod;
import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByOrder_IdAndPaymentStatus(Long orderId, EPaymentStatus paymentStatus);

    @EntityGraph(attributePaths = {"order", "order.table", "order.orderItems", "order.orderItems.product"})
    Optional<Payment> findByOrder_IdAndPaymentStatus(Long orderId, EPaymentStatus paymentStatus);

    @EntityGraph(attributePaths = {"order", "order.table", "promotion"})
    Optional<Payment> findFirstByOrder_IdAndPaymentMethodOrderByIdDesc(
            Long orderId, EPaymentMethod paymentMethod);

    @EntityGraph(attributePaths = {"order", "order.table", "promotion"})
    Optional<Payment> findFirstByOrder_IdAndPaymentMethodAndPaymentStatusOrderByIdDesc(
            Long orderId, EPaymentMethod paymentMethod, EPaymentStatus paymentStatus);

    @EntityGraph(attributePaths = {"order", "order.table", "promotion"})
    Optional<Payment> findByPayosOrderCode(Long payosOrderCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"order", "order.table", "promotion"})
    @Query("select p from Payment p where p.id = :id")
    Optional<Payment> findByIdForUpdate(@Param("id") Long id);
}
