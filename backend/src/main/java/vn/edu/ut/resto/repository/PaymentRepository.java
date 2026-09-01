package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.ut.resto.model.Payment;

import vn.edu.ut.resto.model.enums.EPaymentStatus;


public interface PaymentRepository
        extends JpaRepository<Payment, Long> {


    boolean existsByOrder_IdAndPaymentStatus(
            Long orderId,
            EPaymentStatus paymentStatus
    );
}