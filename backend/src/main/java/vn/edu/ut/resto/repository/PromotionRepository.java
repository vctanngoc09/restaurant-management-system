package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.ut.resto.model.Promotion;

import java.util.Optional;


public interface PromotionRepository
        extends JpaRepository<Promotion, Long> {


    Optional<Promotion>
    findByCodeIgnoreCase(
            String code
    );


    boolean existsByCodeIgnoreCase(
            String code
    );
}