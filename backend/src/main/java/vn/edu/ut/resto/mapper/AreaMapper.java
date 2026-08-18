package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.AreaRequest;
import vn.edu.ut.resto.dto.response.AreaResponse;
import vn.edu.ut.resto.model.Area;

@Component
public class AreaMapper {

    // =========================
    // CREATE REQUEST -> ENTITY
    // =========================

    public Area toEntity(AreaRequest request) {

        if (request == null) {
            return null;
        }

        Area area = new Area();

        area.setName(request.getName());

        return area;
    }


    // =========================
    // UPDATE REQUEST -> ENTITY
    // =========================

    public void updateEntity(
            AreaRequest request,
            Area area
    ) {

        if (request == null || area == null) {
            return;
        }

        area.setName(request.getName());
    }


    // =========================
    // ENTITY -> RESPONSE
    // =========================

    public AreaResponse toResponse(Area area) {

        if (area == null) {
            return null;
        }

        return new AreaResponse(
                area.getId(),
                area.getName()
        );
    }
}