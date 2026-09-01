package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.CashPaymentRequest;

import vn.edu.ut.resto.dto.response.PaymentReceiptResponse;


public interface PaymentService {


    PaymentReceiptResponse payCash(
            Long orderId,
            CashPaymentRequest request
    );
}