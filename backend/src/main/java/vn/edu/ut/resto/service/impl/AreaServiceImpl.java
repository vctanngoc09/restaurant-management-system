package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.dto.request.AreaRequest;
import vn.edu.ut.resto.exception.DuplicateException;
import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.AreaMapper;

import vn.edu.ut.resto.model.Area;

import vn.edu.ut.resto.repository.AreaRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;

import vn.edu.ut.resto.service.AreaService;

import java.util.List;

@Service
public class AreaServiceImpl implements AreaService {

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Autowired
    private AreaMapper areaMapper;


    // =========================
    // CREATE AREA
    // =========================

    @Override
    public Area createArea(AreaRequest request) {

        if (areaRepository.existsByName(request.getName())) {

            throw new DuplicateException(
                    "Tên khu vực đã tồn tại!"
            );
        }

        Area area =
                areaMapper.toEntity(request);

        return areaRepository.save(area);
    }


    // =========================
    // GET ALL AREA
    // =========================

    @Override
    public List<Area> getAllAreas() {

        return areaRepository.findAll();
    }


    // =========================
    // GET AREA BY ID
    // =========================

    @Override
    public Area getAreaById(Long id) {

        return areaRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy khu vực có ID: "
                                        + id
                        )
                );
    }


    // =========================
    // UPDATE AREA
    // =========================

    @Override
    public Area updateArea(
            Long id,
            AreaRequest request
    ) {

        Area area = areaRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy khu vực có ID: "
                                        + id
                        )
                );


        // Check duplicate name
        if (
                areaRepository.existsByNameAndIdNot(
                        request.getName(),
                        id
                )
        ) {

            throw new DuplicateException(
                    "Tên khu vực đã tồn tại!"
            );
        }


        // DTO -> existing entity
        areaMapper.updateEntity(
                request,
                area
        );


        return areaRepository.save(area);
    }


    // =========================
    // DELETE AREA
    // =========================

    @Override
    public void deleteArea(Long id) {

        Area area = areaRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy khu vực có ID: "
                                        + id
                        )
                );


        // Area vẫn còn table -> không cho xóa
        if (tableRepository.existsByAreaId(id)) {

            throw new InvalidOperationException(
                    "Không thể xóa khu vực vì vẫn còn bàn thuộc khu vực này."
            );
        }


        areaRepository.delete(area);
    }
}