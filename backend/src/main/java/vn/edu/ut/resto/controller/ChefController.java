package vn.edu.ut.resto.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import vn.edu.ut.resto.dto.request.UpdateOrderItemStatusRequest;

import vn.edu.ut.resto.dto.response.ApiResponse;
import vn.edu.ut.resto.dto.response.ChefBoardResponse;
import vn.edu.ut.resto.dto.response.KitchenTicketResponse;

import vn.edu.ut.resto.mapper.KitchenTicketMapper;

import vn.edu.ut.resto.model.KitchenTicket;

import vn.edu.ut.resto.service.ChefService;

import java.util.List;


@RestController
@RequestMapping("/api/chef")
@PreAuthorize(
        "hasAnyRole('CHEF', 'ADMIN')"
)
public class ChefController {


    @Autowired
    private ChefService chefService;


    @Autowired
    private KitchenTicketMapper
            kitchenTicketMapper;


    // ==================================================
    // KDS BOARD
    //
    // WAITING
    // PROCESSING
    // READY
    // ==================================================

    @GetMapping("/tickets")
    public ResponseEntity<
            ApiResponse<ChefBoardResponse>
            >
    getBoard() {

        List<KitchenTicketResponse> waiting =
                chefService
                        .getWaitingTickets()
                        .stream()
                        .map(
                                kitchenTicketMapper::toResponse
                        )
                        .toList();


        List<KitchenTicketResponse> processing =
                chefService
                        .getProcessingTickets()
                        .stream()
                        .map(
                                kitchenTicketMapper::toResponse
                        )
                        .toList();


        List<KitchenTicketResponse> ready =
                chefService
                        .getReadyTickets()
                        .stream()
                        .map(
                                kitchenTicketMapper::toResponse
                        )
                        .toList();


        ChefBoardResponse board =
                new ChefBoardResponse(
                        waiting,
                        processing,
                        ready
                );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Lấy bảng điều phối bếp thành công!",
                        board
                )
        );
    }


    // ==================================================
    // START TICKET
    //
    // WAITING -> PROCESSING
    // ==================================================

    @PatchMapping(
            "/tickets/{ticketId}/start"
    )
    public ResponseEntity<
            ApiResponse<KitchenTicketResponse>
            >
    startTicket(
            @PathVariable
            Long ticketId
    ) {

        KitchenTicket ticket =
                chefService
                        .startTicket(
                                ticketId
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Bếp đã nhận phiếu!",
                        kitchenTicketMapper
                                .toResponse(
                                        ticket
                                )
                )
        );
    }


    // ==================================================
    // ITEM
    //
    // PENDING -> COOKING
    // COOKING -> READY
    // ==================================================

    @PatchMapping(
            "/items/{orderItemId}/status"
    )
    public ResponseEntity<
            ApiResponse<KitchenTicketResponse>
            >
    updateItemStatus(
            @PathVariable
            Long orderItemId,

            @Valid
            @RequestBody
            UpdateOrderItemStatusRequest request
    ) {

        KitchenTicket ticket =
                chefService
                        .updateItemStatus(
                                orderItemId,
                                request.getStatus()
                        );


        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Cập nhật trạng thái món thành công!",
                        kitchenTicketMapper
                                .toResponse(
                                        ticket
                                )
                )
        );
    }
}