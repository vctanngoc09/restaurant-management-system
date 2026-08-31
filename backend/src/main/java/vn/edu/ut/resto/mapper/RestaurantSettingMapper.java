package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.RestaurantSettingRequest;
import vn.edu.ut.resto.dto.response.RestaurantSettingResponse;
import vn.edu.ut.resto.model.RestaurantSetting;

@Component
public class RestaurantSettingMapper {

    public RestaurantSetting toEntity(RestaurantSettingRequest request) {

        if (request == null) {
            return null;
        }

        return new RestaurantSetting(
                normalize(request.getName()),
                normalize(request.getPhone()),
                normalize(request.getAddress()),
                normalize(request.getTaxCode()),
                request.getVatRate(),
                normalize(request.getLogoUrl())
        );
    }


    public void updateEntity(
            RestaurantSettingRequest request,
            RestaurantSetting setting
    ) {

        if (request == null || setting == null) {
            return;
        }

        setting.setName(normalize(request.getName()));
        setting.setPhone(normalize(request.getPhone()));
        setting.setAddress(normalize(request.getAddress()));
        setting.setTaxCode(normalize(request.getTaxCode()));
        setting.setVatRate(request.getVatRate());
        setting.setLogoUrl(normalize(request.getLogoUrl()));
    }


    public RestaurantSettingResponse toResponse(
            RestaurantSetting setting
    ) {

        if (setting == null) {
            return null;
        }

        return new RestaurantSettingResponse(
                setting.getId(),
                setting.getName(),
                setting.getPhone(),
                setting.getAddress(),
                setting.getTaxCode(),
                setting.getVatRate(),
                setting.getLogoUrl(),
                setting.getCurrency(),
                setting.getUpdatedAt()
        );
    }


    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}