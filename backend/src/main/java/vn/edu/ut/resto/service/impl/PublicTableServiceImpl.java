package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.dto.response.PublicOrderItemResponse;
import vn.edu.ut.resto.dto.response.PublicTableOrderResponse;

import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;
import vn.edu.ut.resto.model.RestaurantTable;

import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.ETableStatus;

import vn.edu.ut.resto.repository.OrderRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;

import vn.edu.ut.resto.service.PublicTableService;

import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
public class PublicTableServiceImpl
        implements PublicTableService {


    // =========================
    // ACTIVE ORDER STATUS
    // =========================

    private static final Set<EOrderStatus>
            ACTIVE_ORDER_STATUSES =
            EnumSet.of(
                    EOrderStatus.PENDING,
                    EOrderStatus.PROCESSING,
                    EOrderStatus.AWAITING_PAYMENT
            );


    @Autowired
    private RestaurantTableRepository tableRepository;


    @Autowired
    private OrderRepository orderRepository;


    // =========================
    // GET PUBLIC TABLE ORDER
    // =========================

    @Override
    @Transactional(readOnly = true)
    public PublicTableOrderResponse getTableOrderByQrToken(
            String qrToken
    ) {

        // =========================
        // FIND TABLE BY QR TOKEN
        // =========================

        RestaurantTable table =
                tableRepository
                        .findByQrToken(qrToken)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Mã QR không hợp lệ hoặc bàn không tồn tại."
                                )
                        );


        String areaName =
                table.getArea() != null
                        ? table.getArea().getName()
                        : null;


        // =========================
        // INACTIVE TABLE
        // =========================

        if (table.getStatus() == ETableStatus.INACTIVE) {

            return buildEmptyResponse(
                    table,
                    areaName,
                    "Bàn này hiện đã ngừng hoạt động."
            );
        }


        // =========================
        // MAINTENANCE TABLE
        // =========================

        if (table.getStatus() == ETableStatus.MAINTENANCE) {

            return buildEmptyResponse(
                    table,
                    areaName,
                    "Bàn này hiện đang bảo trì."
            );
        }


        // =========================
        // AVAILABLE TABLE
        // =========================

        if (table.getStatus() == ETableStatus.AVAILABLE) {

            return buildEmptyResponse(
                    table,
                    areaName,
                    "Bàn hiện chưa có món ăn nào."
            );
        }


        // =========================
        // OCCUPIED
        // FIND ACTIVE ORDER
        // =========================

        Optional<Order> activeOrder =
                orderRepository
                        .findFirstByTable_IdAndStatusInOrderByCreatedAtDesc(
                                table.getId(),
                                ACTIVE_ORDER_STATUSES
                        );


        // =========================
        // OCCUPIED BUT NO ORDER
        // =========================

        if (activeOrder.isEmpty()) {

            return buildEmptyResponse(
                    table,
                    areaName,
                    "Bàn hiện chưa có món ăn nào."
            );
        }


        Order order = activeOrder.get();


        // =========================
        // MAP ITEMS
        // =========================

        List<PublicOrderItemResponse> items =
                order
                        .getOrderItems()
                        .stream()
                        .map(this::toPublicItemResponse)
                        .toList();


        return new PublicTableOrderResponse(
                table.getTableNumber(),
                areaName,
                table.getStatus().name(),
                true,
                "Danh sách món ăn hiện tại của bàn.",
                order.getTotalPrice(),
                items
        );
    }


    // =========================
    // MAP ORDER ITEM
    // =========================

    private PublicOrderItemResponse toPublicItemResponse(
            OrderItem item
    ) {

        double lineTotal =
                item.getPrice()
                        * item.getQuantity();


        return new PublicOrderItemResponse(

                item.getProduct() != null
                        ? item.getProduct().getName()
                        : "Món ăn",

                item.getPrice(),

                item.getQuantity(),

                item.getNote(),

                item.getStatus() != null
                        ? item.getStatus().name()
                        : null,

                lineTotal
        );
    }


    // =========================
    // EMPTY RESPONSE
    // =========================

    private PublicTableOrderResponse buildEmptyResponse(
            RestaurantTable table,
            String areaName,
            String message
    ) {

        return new PublicTableOrderResponse(
                table.getTableNumber(),
                areaName,
                table.getStatus().name(),
                false,
                message,
                0D,
                List.of()
        );
    }
}