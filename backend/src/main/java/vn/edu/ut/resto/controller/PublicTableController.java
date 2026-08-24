package vn.edu.ut.resto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.PublicTableOrderResponse;

import vn.edu.ut.resto.service.PublicTableService;


@RestController
@RequestMapping("/api/public/tables")
public class PublicTableController {


    @Autowired
    private PublicTableService publicTableService;


    // =========================
    // GET TABLE ORDER BY QR
    // PUBLIC - READ ONLY
    // =========================

    @GetMapping("/{qrToken}")
    public ResponseEntity<
            ApiResponse<PublicTableOrderResponse>
            >
    getTableOrderByQrToken(
            @PathVariable String qrToken
    ) {

        PublicTableOrderResponse response =
                publicTableService
                        .getTableOrderByQrToken(
                                qrToken
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy thông tin bàn thành công!",
                        response
                )
        );
    }
}