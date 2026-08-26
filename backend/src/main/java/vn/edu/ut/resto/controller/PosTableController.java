package vn.edu.ut.resto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.PageResponse;
import vn.edu.ut.resto.dto.response.TableResponse;

import vn.edu.ut.resto.mapper.RestaurantTableMapper;

import vn.edu.ut.resto.model.enums.ETableStatus;

import vn.edu.ut.resto.service.RestaurantTableService;


@RestController
@RequestMapping("/api/tables")
@PreAuthorize(
        "hasAnyRole('WAITER', 'CASHIER', 'ADMIN')"
)
public class PosTableController {


    @Autowired
    private RestaurantTableService tableService;


    @Autowired
    private RestaurantTableMapper tableMapper;

    @GetMapping
    public ResponseEntity<
            ApiResponse<PageResponse<TableResponse>>
            >
    getTables(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "50"
            )
            int size,

            @RequestParam(
                    required = false
            )
            String keyword,

            @RequestParam(
                    required = false
            )
            Long areaId,

            @RequestParam(
                    required = false
            )
            ETableStatus status
    ) {

        Page<TableResponse> tablePage =
                tableService
                        .getAllTables(
                                page,
                                size,
                                keyword,
                                areaId,
                                status
                        )
                        .map(
                                tableMapper::toResponse
                        );


        PageResponse<TableResponse> response =
                PageResponse.from(
                        tablePage
                );


        return ResponseEntity.ok(

                new ApiResponse<>(

                        200,

                        "Lấy danh sách bàn phục vụ thành công!",

                        response
                )
        );
    }
}