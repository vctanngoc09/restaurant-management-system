package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;
import vn.edu.ut.resto.dto.request.OrderItemRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;
import vn.edu.ut.resto.exception.UnauthorizedException;

import vn.edu.ut.resto.mapper.OrderMapper;

import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;
import vn.edu.ut.resto.model.Product;
import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.User;

import vn.edu.ut.resto.model.enums.EOrderItemStatus;
import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.EOrderType;
import vn.edu.ut.resto.model.enums.EProductStatus;
import vn.edu.ut.resto.model.enums.ETableStatus;

import vn.edu.ut.resto.repository.OrderRepository;
import vn.edu.ut.resto.repository.ProductRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;
import vn.edu.ut.resto.repository.UserRepository;

import vn.edu.ut.resto.service.OrderService;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;


@Service
public class OrderServiceImpl
        implements OrderService {


    // ==================================================
    // ACTIVE ORDER STATUSES
    // ==================================================

    /*
     * Những trạng thái cho biết
     * Order vẫn chưa kết thúc.
     */
    private static final Set<EOrderStatus>
            ACTIVE_ORDER_STATUSES =
            EnumSet.of(
                    EOrderStatus.PENDING,
                    EOrderStatus.PROCESSING,
                    EOrderStatus.AWAITING_PAYMENT
            );


    /*
     * Chỉ cho phép gọi thêm món
     * khi Order chưa bước vào thanh toán.
     *
     * PENDING:
     * đơn vừa được tạo.
     *
     * PROCESSING:
     * bếp đang xử lý đơn.
     */
    private static final Set<EOrderStatus>
            ADD_ITEM_ALLOWED_STATUSES =
            EnumSet.of(
                    EOrderStatus.PENDING,
                    EOrderStatus.PROCESSING
            );


    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private RestaurantTableRepository tableRepository;


    @Autowired
    private ProductRepository productRepository;


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private OrderMapper orderMapper;


    // ==================================================
    // CREATE ORDER
    // ==================================================

    @Override
    @Transactional
    public Order createOrder(
            CreateOrderRequest request
    ) {

        // ==================================================
        // CURRENTLY ONLY SUPPORT DINE IN
        // ==================================================

        if (
                request.getOrderType()
                        != EOrderType.DINE_IN
        ) {

            throw new InvalidOperationException(
                    "Hiện tại chức năng tạo đơn chỉ hỗ trợ đơn tại bàn."
            );
        }


        // ==================================================
        // TABLE REQUIRED
        // ==================================================

        if (request.getTableId() == null) {

            throw new InvalidOperationException(
                    "Đơn tại chỗ bắt buộc phải chọn bàn."
            );
        }


        // ==================================================
        // FIND TABLE
        // ==================================================

        RestaurantTable table =
                tableRepository
                        .findById(
                                request.getTableId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy bàn có ID: "
                                                + request.getTableId()
                                )
                        );


        // ==================================================
        // CHECK TABLE STATUS
        // ==================================================

        if (
                table.getStatus()
                        != ETableStatus.AVAILABLE
        ) {

            throw new InvalidOperationException(
                    "Bàn "
                            + table.getTableNumber()
                            + " hiện không khả dụng."
            );
        }


        // ==================================================
        // CHECK ACTIVE ORDER
        // ==================================================

        if (
                orderRepository
                        .existsByTable_IdAndStatusIn(
                                table.getId(),
                                ACTIVE_ORDER_STATUSES
                        )
        ) {

            throw new InvalidOperationException(
                    "Bàn "
                            + table.getTableNumber()
                            + " đang có đơn hàng chưa hoàn tất."
            );
        }


        // ==================================================
        // CURRENT USER
        // ==================================================

        User currentUser =
                getCurrentUser();


        // ==================================================
        // CREATE ORDER
        // ==================================================

        Order order =
                orderMapper
                        .toEntity(
                                request
                        );


        order.setUser(
                currentUser
        );


        order.setTable(
                table
        );


        order.setStatus(
                EOrderStatus.PENDING
        );


        // ==================================================
        // CREATE ORDER ITEMS
        // ==================================================

        List<OrderItem> orderItems =
                new ArrayList<>();


        double totalPrice = 0D;


        for (
                OrderItemRequest itemRequest
                : request.getItems()
        ) {

            Product product =
                    productRepository
                            .findById(
                                    itemRequest.getProductId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Không tìm thấy sản phẩm có ID: "
                                                    + itemRequest.getProductId()
                                    )
                            );


            // ==================================================
            // CHECK PRODUCT AVAILABLE
            // ==================================================

            if (
                    product.getStatus()
                            != EProductStatus.AVAILABLE
            ) {

                throw new InvalidOperationException(
                        "Món "
                                + product.getName()
                                + " hiện không thể gọi."
                );
            }


            // ==================================================
            // CREATE ORDER ITEM
            // ==================================================

            OrderItem orderItem =
                    new OrderItem();


            /*
             * Lưu giá tại thời điểm gọi món.
             *
             * Sau này Admin thay đổi giá Product
             * thì Order cũ vẫn giữ nguyên.
             */
            orderItem.setPrice(
                    product.getPrice()
            );


            orderItem.setQuantity(
                    itemRequest.getQuantity()
            );


            orderItem.setNote(
                    normalizeNote(
                            itemRequest.getNote()
                    )
            );


            orderItem.setStatus(
                    EOrderItemStatus.PENDING
            );


            orderItem.setProduct(
                    product
            );


            orderItem.setOrder(
                    order
            );


            orderItems.add(
                    orderItem
            );


            totalPrice +=
                    product.getPrice()
                            * itemRequest.getQuantity();
        }


        order.setOrderItems(
                orderItems
        );


        order.setTotalPrice(
                totalPrice
        );


        order.setNote(
                normalizeNote(
                        order.getNote()
                )
        );


        // ==================================================
        // TABLE -> OCCUPIED
        // ==================================================

        table.setStatus(
                ETableStatus.OCCUPIED
        );


        // ==================================================
        // SAVE
        // ==================================================

        Order savedOrder =
                orderRepository.save(
                        order
                );


        tableRepository.save(
                table
        );


        return savedOrder;
    }


    // ==================================================
    // GET ACTIVE ORDER BY TABLE
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public Order getActiveOrderByTable(
            Long tableId
    ) {

        RestaurantTable table =
                tableRepository
                        .findById(tableId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy bàn có ID: "
                                                + tableId
                                )
                        );


        return orderRepository
                .findFirstByTable_IdAndStatusInOrderByCreatedAtDesc(
                        table.getId(),
                        ACTIVE_ORDER_STATUSES
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Bàn "
                                        + table.getTableNumber()
                                        + " hiện chưa có đơn hàng đang hoạt động."
                        )
                );
    }


    // ==================================================
    // ADD ITEMS TO ORDER
    // GỌI THÊM MÓN
    // ==================================================

    @Override
    @Transactional
    public Order addItemsToOrder(
            Long orderId,
            AddOrderItemsRequest request
    ) {

        // ==================================================
        // FIND ORDER
        // ==================================================

        Order order =
                orderRepository
                        .findByIdWithDetails(
                                orderId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy đơn hàng có ID: "
                                                + orderId
                                )
                        );


        // ==================================================
        // ONLY DINE IN FOR NOW
        // ==================================================

        if (
                order.getOrderType()
                        != EOrderType.DINE_IN
        ) {

            throw new InvalidOperationException(
                    "Chức năng gọi thêm món hiện chỉ áp dụng cho đơn tại bàn."
            );
        }


        // ==================================================
        // CHECK ORDER STATUS
        // ==================================================

        if (
                !ADD_ITEM_ALLOWED_STATUSES
                        .contains(
                                order.getStatus()
                        )
        ) {

            if (
                    order.getStatus()
                            == EOrderStatus.AWAITING_PAYMENT
            ) {

                throw new InvalidOperationException(
                        "Đơn hàng đang chờ thanh toán, không thể gọi thêm món."
                );
            }


            throw new InvalidOperationException(
                    "Đơn hàng này không còn cho phép gọi thêm món."
            );
        }


        // ==================================================
        // CHECK TABLE
        // ==================================================

        RestaurantTable table =
                order.getTable();


        if (table == null) {

            throw new InvalidOperationException(
                    "Đơn hàng không thuộc bàn ăn nào."
            );
        }


        // ==================================================
        // TABLE MUST BE OCCUPIED
        // ==================================================

        if (
                table.getStatus()
                        != ETableStatus.OCCUPIED
        ) {

            throw new InvalidOperationException(
                    "Bàn "
                            + table.getTableNumber()
                            + " hiện không ở trạng thái đang phục vụ."
            );
        }


        // ==================================================
        // GET CURRENT ORDER ITEMS
        // ==================================================

        List<OrderItem> orderItems =
                order.getOrderItems();


        if (orderItems == null) {

            orderItems =
                    new ArrayList<>();

            order.setOrderItems(
                    orderItems
            );
        }

        for (
                OrderItemRequest itemRequest
                : request.getItems()
        ) {

            // ==================================================
            // FIND PRODUCT
            // ==================================================

            Product product =
                    productRepository
                            .findById(
                                    itemRequest.getProductId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Không tìm thấy sản phẩm có ID: "
                                                    + itemRequest.getProductId()
                                    )
                            );


            // ==================================================
            // CHECK PRODUCT STATUS
            // ==================================================

            if (
                    product.getStatus()
                            != EProductStatus.AVAILABLE
            ) {

                throw new InvalidOperationException(
                        "Món "
                                + product.getName()
                                + " hiện không thể gọi."
                );
            }


            // ==================================================
            // CREATE NEW ORDER ITEM
            // ==================================================

            OrderItem orderItem =
                    new OrderItem();


            /*
             * Quan trọng:
             *
             * Gọi thêm món phải tạo OrderItem mới.
             *
             * Không cộng quantity vào item cũ
             * vì item cũ có thể đã:
             *
             * COOKING
             * READY
             * SERVED
             *
             * Item mới phải bắt đầu từ PENDING.
             */
            orderItem.setPrice(
                    product.getPrice()
            );


            orderItem.setQuantity(
                    itemRequest.getQuantity()
            );


            orderItem.setNote(
                    normalizeNote(
                            itemRequest.getNote()
                    )
            );


            orderItem.setStatus(
                    EOrderItemStatus.PENDING
            );


            orderItem.setProduct(
                    product
            );


            orderItem.setOrder(
                    order
            );


            orderItems.add(
                    orderItem
            );
        }


        // ==================================================
        // RECALCULATE TOTAL PRICE
        // ==================================================

        double totalPrice =
                orderItems
                        .stream()
                        .mapToDouble(
                                item ->
                                        item.getPrice()
                                                * item.getQuantity()
                        )
                        .sum();


        order.setTotalPrice(
                totalPrice
        );


        /*
         * KHÔNG thay đổi status của Order.
         *
         * Nếu trước đó:
         *
         * PENDING
         * -> vẫn PENDING
         *
         * PROCESSING
         * -> vẫn PROCESSING
         *
         * Chỉ OrderItem mới:
         * -> PENDING
         */


        // ==================================================
        // SAVE ORDER
        // CascadeType.ALL sẽ lưu luôn OrderItem mới
        // ==================================================

        return orderRepository.save(
                order
        );
    }


    // ==================================================
    // CURRENT USER
    // ==================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication == null
                        || !authentication.isAuthenticated()
                        || "anonymousUser"
                        .equals(
                                authentication.getPrincipal()
                        )
        ) {

            throw new UnauthorizedException(
                    "Người dùng chưa đăng nhập."
            );
        }


        String username =
                authentication.getName();


        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy tài khoản đang đăng nhập."
                        )
                );
    }


    // ==================================================
    // NORMALIZE NOTE
    // ==================================================

    private String normalizeNote(
            String note
    ) {

        if (note == null) {
            return null;
        }


        String normalized =
                note.trim();


        if (normalized.isEmpty()) {
            return null;
        }


        return normalized;
    }
}