package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.ut.resto.model.Payment;

import vn.edu.ut.resto.model.enums.EPaymentStatus;

import java.util.Optional;


public interface PaymentRepository
        extends JpaRepository<Payment, Long> {


    boolean existsByOrder_IdAndPaymentStatus(
            Long orderId,
            EPaymentStatus paymentStatus
    );

    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.table",
                    "order.orderItems",
                    "order.orderItems.product"
            }
    )
    Optional<Payment> findByOrder_IdAndPaymentStatus(
            Long orderId,
            EPaymentStatus paymentStatus
    );
}