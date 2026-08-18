package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.request.AreaRequest;
import vn.edu.ut.resto.model.Area;

import java.util.List;

public interface AreaService {

    Area createArea(AreaRequest request);

    List<Area> getAllAreas();

    Area getAreaById(Long id);

    Area updateArea(
            Long id,
            AreaRequest request
    );

    void deleteArea(Long id);
}