package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.ut.resto.model.RestaurantSetting;

import java.util.Optional;

public interface RestaurantSettingRepository
        extends JpaRepository<RestaurantSetting, Long> {

    Optional<RestaurantSetting>
    findFirstByOrderByIdAsc();
}