package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.RestaurantSettingRequest;
import vn.edu.ut.resto.model.RestaurantSetting;

public interface RestaurantSettingService {

    RestaurantSetting getCurrentSetting();


    RestaurantSetting createSetting(
            RestaurantSettingRequest request
    );


    RestaurantSetting updateSetting(
            RestaurantSettingRequest request
    );
}