package vn.edu.ut.resto.controller;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.ProductResponse;

import vn.edu.ut.resto.mapper.ProductMapper;

import vn.edu.ut.resto.service.ProductService;

import java.util.List;


@RestController
@RequestMapping("/api/menu")
@PreAuthorize(
        "hasAnyRole('WAITER', 'CASHIER', 'ADMIN')"
)
public class PosMenuController {


    @Autowired
    private ProductService productService;


    @Autowired
    private ProductMapper productMapper;


    // =========================
    // GET MENU FOR POS
    // =========================

    @GetMapping("/products")
    public ResponseEntity<
            ApiResponse<List<ProductResponse>>
            >
    getMenuProducts() {


        List<ProductResponse> products =
                productService
                        .getMenuProducts()
                        .stream()
                        .map(
                                productMapper::toResponse
                        )
                        .toList();


        return ResponseEntity.ok(

                new ApiResponse<>(

                        200,

                        "Lấy thực đơn thành công!",

                        products
                )
        );
    }
}