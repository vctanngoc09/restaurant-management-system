package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.dto.request.RestaurantSettingRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.RestaurantSettingMapper;
import vn.edu.ut.resto.model.RestaurantSetting;

import vn.edu.ut.resto.repository.RestaurantSettingRepository;

import vn.edu.ut.resto.service.RestaurantSettingService;


@Service
public class RestaurantSettingServiceImpl
        implements RestaurantSettingService {


    @Autowired
    private RestaurantSettingRepository restaurantSettingRepository;

    @Autowired
    private RestaurantSettingMapper restaurantSettingMapper;


    // ==================================================
    // GET CURRENT SETTING
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public RestaurantSetting getCurrentSetting() {

        return restaurantSettingRepository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Nhà hàng chưa được cấu hình."
                        )
                );
    }


    // ==================================================
    // CREATE
    //
    // Chỉ được tạo 1 lần.
    // ==================================================

    @Override
    @Transactional
    public RestaurantSetting createSetting(
            RestaurantSettingRequest request
    ) {

        if (restaurantSettingRepository
                .findFirstByOrderByIdAsc()
                .isPresent()) {

            throw new InvalidOperationException(
                    "Thông tin nhà hàng đã tồn tại. Vui lòng sử dụng chức năng cập nhật."
            );
        }

        RestaurantSetting setting =
                restaurantSettingMapper.toEntity(request);

        return restaurantSettingRepository.save(setting);
    }


    // ==================================================
    // UPDATE
    // ==================================================

    @Override
    @Transactional
    public RestaurantSetting updateSetting(
            RestaurantSettingRequest request
    ) {

        RestaurantSetting setting =
                restaurantSettingRepository
                        .findFirstByOrderByIdAsc()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Nhà hàng chưa được cấu hình."
                                )
                        );

        restaurantSettingMapper.updateEntity(
                request,
                setting
        );

        return restaurantSettingRepository.save(setting);
    }
}