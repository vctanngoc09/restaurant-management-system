package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.PromotionRequest;

import vn.edu.ut.resto.model.Promotion;

import java.math.BigDecimal;

import java.util.List;


public interface PromotionService {


    Promotion create(
            PromotionRequest request
    );


    Promotion update(
            Long id,
            PromotionRequest request
    );


    Promotion getById(
            Long id
    );


    List<Promotion> getAll();


    Promotion setActive(
            Long id,
            boolean active
    );


    Promotion getValidPromotion(
            String code,
            BigDecimal subtotal
    );


    BigDecimal calculateDiscount(
            Promotion promotion,
            BigDecimal subtotal
    );
}