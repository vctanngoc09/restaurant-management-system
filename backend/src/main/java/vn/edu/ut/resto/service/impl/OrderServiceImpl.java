package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.dto.request.AddOrderItemsRequest;
import vn.edu.ut.resto.dto.request.CreateOrderRequest;
import vn.edu.ut.resto.dto.request.OrderItemRequest;
import vn.edu.ut.resto.dto.request.ShippingDetailRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;
import vn.edu.ut.resto.exception.UnauthorizedException;

import vn.edu.ut.resto.mapper.OrderMapper;

import vn.edu.ut.resto.model.KitchenTicket;
import vn.edu.ut.resto.model.Order;
import vn.edu.ut.resto.model.OrderItem;
import vn.edu.ut.resto.model.Product;
import vn.edu.ut.resto.model.RestaurantTable;
import vn.edu.ut.resto.model.ShippingDetail;
import vn.edu.ut.resto.model.User;

import vn.edu.ut.resto.model.enums.EKitchenTicketStatus;
import vn.edu.ut.resto.model.enums.EOrderItemStatus;
import vn.edu.ut.resto.model.enums.EOrderStatus;
import vn.edu.ut.resto.model.enums.EOrderType;
import vn.edu.ut.resto.model.enums.EProductStatus;
import vn.edu.ut.resto.model.enums.ETableStatus;

import vn.edu.ut.resto.repository.KitchenTicketRepository;
import vn.edu.ut.resto.repository.OrderItemRepository;
import vn.edu.ut.resto.repository.OrderRepository;
import vn.edu.ut.resto.repository.ProductRepository;
import vn.edu.ut.resto.repository.RestaurantTableRepository;
import vn.edu.ut.resto.repository.UserRepository;

import vn.edu.ut.resto.service.OrderService;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;


@Service
public class OrderServiceImpl
        implements OrderService {


    // ==================================================
    // ACTIVE ORDER
    // ==================================================

    private static final Set<EOrderStatus>
            ACTIVE_ORDER_STATUSES =
            EnumSet.of(
                    EOrderStatus.PENDING,
                    EOrderStatus.PROCESSING,
                    EOrderStatus.AWAITING_PAYMENT
            );


    // ==================================================
    // DINE IN ADD ITEM
    // ==================================================

    private static final Set<EOrderStatus>
            ADD_ITEM_ALLOWED_STATUSES =
            EnumSet.of(
                    EOrderStatus.PENDING,
                    EOrderStatus.PROCESSING
            );


    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private OrderItemRepository orderItemRepository;


    @Autowired
    private KitchenTicketRepository
            kitchenTicketRepository;


    @Autowired
    private RestaurantTableRepository
            tableRepository;


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

        validateCreateOrderRequest(
                request
        );


        User currentUser =
                getCurrentUser();


        RestaurantTable table =
                null;


        // ==================================================
        // DINE IN TABLE
        // ==================================================

        if (
                request.getOrderType()
                        == EOrderType.DINE_IN
        ) {

            table =
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
        }


        // ==================================================
        // ORDER
        // ==================================================

        Order order =
                orderMapper.toEntity(
                        request
                );


        order.setUser(
                currentUser
        );


        order.setTable(
                table
        );


        // ==================================================
        // INITIAL STATUS
        // ==================================================

        if (
                request.getOrderType()
                        == EOrderType.DINE_IN
        ) {

            order.setStatus(
                    EOrderStatus.PENDING
            );

        } else {

            /*
             * TAKE_AWAY / DELIVERY
             *
             * phải thanh toán trước.
             */
            order.setStatus(
                    EOrderStatus.AWAITING_PAYMENT
            );
        }


        order.setNote(
                normalizeNote(
                        order.getNote()
                )
        );


        // ==================================================
        // ITEMS
        // ==================================================

        List<OrderItem> orderItems =
                new ArrayList<>();


        for (
                OrderItemRequest itemRequest
                : request.getItems()
        ) {

            OrderItem item =
                    createOrderItem(
                            order,
                            itemRequest
                    );


            /*
             * Quan trọng:
             *
             * Chưa assign KitchenTicket ở đây.
             *
             * DINE_IN:
             * assign sau khi Order save.
             *
             * TAKE_AWAY / DELIVERY:
             * giữ null tới khi payment success.
             */
            orderItems.add(
                    item
            );
        }


        order.setOrderItems(
                orderItems
        );


        recalculateTotal(
                order
        );


        // ==================================================
        // DELIVERY
        // ==================================================

        if (
                request.getOrderType()
                        == EOrderType.DELIVERY
        ) {

            ShippingDetailRequest shippingRequest =
                    request.getShippingDetail();


            ShippingDetail shippingDetail =
                    new ShippingDetail();


            shippingDetail.setCustomerName(
                    shippingRequest
                            .getCustomerName()
                            .trim()
            );


            shippingDetail.setCustomerPhone(
                    shippingRequest
                            .getCustomerPhone()
                            .trim()
            );


            shippingDetail.setAddress(
                    shippingRequest
                            .getAddress()
                            .trim()
            );


            shippingDetail.setDistance(
                    shippingRequest
                            .getDistance()
            );


            shippingDetail.setEstimatedTime(
                    shippingRequest
                            .getEstimatedTime()
            );


            shippingDetail.setOrder(
                    order
            );


            order.setShippingDetail(
                    shippingDetail
            );
        }


        // ==================================================
        // TABLE OCCUPIED
        // ==================================================

        if (table != null) {

            table.setStatus(
                    ETableStatus.OCCUPIED
            );
        }


        // ==================================================
        // SAVE ORDER FIRST
        // ==================================================

        Order savedOrder =
                orderRepository.save(
                        order
                );


        /*
         * DINE_IN:
         *
         * tạo KitchenTicket ngay vì
         * không cần thanh toán trước.
         */
        if (
                savedOrder.getOrderType()
                        == EOrderType.DINE_IN
        ) {

            createKitchenTicket(
                    savedOrder,
                    savedOrder.getOrderItems()
            );
        }


        if (table != null) {

            tableRepository.save(
                    table
            );
        }


        return getOrderDetails(
                savedOrder.getId()
        );
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
    // GET ACTIVE BY TYPE
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public List<Order> getActiveOrdersByType(
            EOrderType orderType
    ) {

        return orderRepository
                .findByOrderTypeAndStatusInOrderByCreatedAtDesc(
                        orderType,
                        ACTIVE_ORDER_STATUSES
                );
    }


    // ==================================================
// ADD ITEMS
//
// DINE_IN ONLY
//
// Mỗi lần gọi thêm món
// = một KitchenTicket mới.
// ==================================================

    @Override
    @Transactional
    public Order addItemsToDineInOrder(
            Long orderId,
            AddOrderItemsRequest request
    ) {

        // ==================================================
        // FIND ORDER + LOCK
        //
        // Tránh 2 request đồng thời
        // tạo cùng batchNumber.
        // ==================================================

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy đơn hàng có ID: "
                                                + orderId
                                )
                        );


        // ==================================================
        // ONLY DINE IN
        // ==================================================

        if (
                order.getOrderType()
                        != EOrderType.DINE_IN
        ) {

            throw new InvalidOperationException(
                    "Chức năng gọi thêm món chỉ áp dụng cho đơn tại bàn."
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
                    "Đơn hàng không còn cho phép gọi thêm món."
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
        // CREATE NEW ITEMS
        //
        // QUAN TRỌNG:
        //
        // Chưa add vào
        // order.getOrderItems() ở đây.
        //
        // Nếu add trước rồi save(order),
        // Cascade MERGE có thể tạo bản copy
        // và gây duplicate item.
        // ==================================================

        List<OrderItem> newItems =
                new ArrayList<>();


        for (
                OrderItemRequest itemRequest
                : request.getItems()
        ) {

            OrderItem item =
                    createOrderItem(
                            order,
                            itemRequest
                    );


            newItems.add(
                    item
            );
        }


        // ==================================================
        // CREATE KITCHEN TICKET
        //
        // Method này:
        //
        // 1. tạo ticket
        // 2. gắn ticket vào item
        // 3. saveAll(newItems)
        //
        // Mỗi OrderItem chỉ persist 1 lần.
        // ==================================================

        createKitchenTicket(
                order,
                newItems
        );


        // ==================================================
        // ADD ITEMS TO MANAGED ORDER
        //
        // Sau khi item đã được persist
        // và đã có ID.
        // ==================================================

        order.getOrderItems()
                .addAll(
                        newItems
                );


        // ==================================================
        // RECALCULATE TOTAL
        // ==================================================

        recalculateTotal(
                order
        );


        /*
         * KHÔNG gọi:
         *
         * orderRepository.save(order);
         *
         * Order được find bên trên đang là
         * Managed Entity vì đang nằm trong
         * @Transactional.
         *
         * Hibernate Dirty Checking sẽ tự:
         *
         * UPDATE orders
         * SET total_price = ...
         */


        // ==================================================
        // FLUSH
        //
        // Đẩy INSERT item + UPDATE total
        // xuống DB trước khi query response.
        // ==================================================

        orderRepository.flush();


        // ==================================================
        // RETURN FRESH ORDER
        // ==================================================

        return getOrderDetails(
                order.getId()
        );
    }


    // ==================================================
    // SERVE ITEM
    //
    // READY -> SERVED
    // ==================================================

    @Override
    @Transactional
    public Order serveOrderItem(
            Long orderItemId,

            Collection<EOrderType>
                    allowedOrderTypes
    ) {

        OrderItem item =
                orderItemRepository
                        .findWithDetailsById(
                                orderItemId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy món trong đơn có ID: "
                                                + orderItemId
                                )
                        );


        Order order =
                item.getOrder();


        if (order == null) {

            throw new InvalidOperationException(
                    "Món không thuộc đơn hàng nào."
            );
        }


        // ==================================================
        // ROLE BUSINESS GUARD
        // ==================================================

        if (
                allowedOrderTypes == null
                        ||
                        !allowedOrderTypes.contains(
                                order.getOrderType()
                        )
        ) {

            throw new InvalidOperationException(
                    "Bạn không được phép phục vụ loại đơn hàng này."
            );
        }


        // ==================================================
        // READY ONLY
        // ==================================================

        if (
                item.getStatus()
                        != EOrderItemStatus.READY
        ) {

            throw new InvalidOperationException(
                    "Chỉ món READY mới có thể được phục vụ."
            );
        }


        item.setStatus(
                EOrderItemStatus.SERVED
        );


        orderItemRepository.save(
                item
        );


        // ==================================================
        // KITCHEN TICKET DONE?
        // ==================================================

        KitchenTicket ticket =
                item.getKitchenTicket();


        if (ticket != null) {

            boolean hasUnservedItem =
                    orderItemRepository
                            .existsByKitchenTicket_IdAndStatusNot(
                                    ticket.getId(),
                                    EOrderItemStatus.SERVED
                            );


            if (!hasUnservedItem) {

                ticket.setStatus(
                        EKitchenTicketStatus.DONE
                );


                ticket.setDoneAt(
                        LocalDateTime.now()
                );


                kitchenTicketRepository.save(
                        ticket
                );
            }
        }


        // ==================================================
        // ORDER ALL SERVED?
        // ==================================================

        boolean orderHasUnservedItem =
                orderItemRepository
                        .existsByOrder_IdAndStatusNot(
                                order.getId(),
                                EOrderItemStatus.SERVED
                        );


        /*
         * TAKE_AWAY / DELIVERY
         *
         * đã thanh toán trước.
         * giao hết món -> COMPLETED.
         */
        if (
                !orderHasUnservedItem
                        &&
                        (
                                order.getOrderType()
                                        == EOrderType.TAKE_AWAY
                                        ||
                                        order.getOrderType()
                                                == EOrderType.DELIVERY
                        )
        ) {

            order.setStatus(
                    EOrderStatus.COMPLETED
            );


            orderRepository.save(
                    order
            );
        }


        /*
         * DINE_IN:
         *
         * dù tất cả SERVED
         * Order vẫn PROCESSING.
         *
         * Sau này:
         * request payment
         * -> AWAITING_PAYMENT.
         */


        return getOrderDetails(
                order.getId()
        );
    }


    // ==================================================
    // FIRE UNFIRED ITEMS
    //
    // PAYMENT dùng sau này.
    // ==================================================

    @Override
    @Transactional
    public KitchenTicket fireUnfiredItemsToKitchen(
            Long orderId
    ) {

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy đơn hàng có ID: "
                                                + orderId
                                )
                        );


        if (
                order.getOrderType()
                        == EOrderType.DINE_IN
        ) {

            throw new InvalidOperationException(
                    "Đơn tại bàn được gửi xuống bếp trực tiếp, không dùng chức năng này."
            );
        }


        /*
         * Payment SUCCESS sau này:
         *
         * AWAITING_PAYMENT
         * ->
         * PENDING
         *
         * rồi mới gọi method này.
         */
        if (
                order.getStatus()
                        != EOrderStatus.PENDING
        ) {

            throw new InvalidOperationException(
                    "Đơn hàng chưa sẵn sàng để gửi xuống bếp."
            );
        }


        List<OrderItem> unfiredItems =
                order.getOrderItems()
                        .stream()
                        .filter(
                                item ->
                                        item.getKitchenTicket()
                                                == null
                        )
                        .toList();


        if (unfiredItems.isEmpty()) {

            throw new InvalidOperationException(
                    "Không có món mới cần gửi xuống bếp."
            );
        }


        return createKitchenTicket(
                order,
                unfiredItems
        );
    }


    // ==================================================
    // CREATE ORDER ITEM
    // ==================================================

    private OrderItem createOrderItem(
            Order order,
            OrderItemRequest request
    ) {

        Product product =
                productRepository
                        .findById(
                                request.getProductId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy sản phẩm có ID: "
                                                + request.getProductId()
                                )
                        );


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


        OrderItem item =
                new OrderItem();


        /*
         * Snapshot giá tại thời điểm đặt.
         */
        item.setPrice(
                product.getPrice()
        );


        item.setQuantity(
                request.getQuantity()
        );


        item.setNote(
                normalizeNote(
                        request.getNote()
                )
        );


        item.setStatus(
                EOrderItemStatus.PENDING
        );


        item.setProduct(
                product
        );


        item.setOrder(
                order
        );


        return item;
    }


    // ==================================================
    // CREATE KITCHEN TICKET
    // ==================================================

    private KitchenTicket createKitchenTicket(
            Order order,
            List<OrderItem> items
    ) {

        if (
                items == null
                        ||
                        items.isEmpty()
        ) {

            throw new InvalidOperationException(
                    "Phiếu bếp phải có ít nhất một món."
            );
        }


        Integer maxBatch =
                kitchenTicketRepository
                        .findMaxBatchNumberByOrderId(
                                order.getId()
                        );


        int nextBatch =
                maxBatch + 1;


        KitchenTicket ticket =
                new KitchenTicket();


        ticket.setOrder(
                order
        );


        ticket.setBatchNumber(
                nextBatch
        );


        ticket.setStatus(
                EKitchenTicketStatus.WAITING
        );


        ticket.setFiredAt(
                LocalDateTime.now()
        );


        /*
         * Save trước để ticket có ID.
         */
        KitchenTicket savedTicket =
                kitchenTicketRepository.save(
                        ticket
                );


        // ==================================================
        // ASSIGN ITEMS
        // ==================================================

        for (
                OrderItem item
                : items
        ) {

            item.setKitchenTicket(
                    savedTicket
            );
        }


        orderItemRepository.saveAll(
                items
        );


        savedTicket.setItems(
                new ArrayList<>(
                        items
                )
        );


        return savedTicket;
    }


    // ==================================================
    // RECALCULATE TOTAL
    // ==================================================

    private void recalculateTotal(
            Order order
    ) {

        double total =
                order.getOrderItems()
                        .stream()
                        .mapToDouble(
                                item ->
                                        item.getPrice()
                                                *
                                                item.getQuantity()
                        )
                        .sum();


        order.setTotalPrice(
                total
        );
    }


    // ==================================================
    // GET ORDER DETAILS
    // ==================================================

    private Order getOrderDetails(
            Long orderId
    ) {

        return orderRepository
                .findByIdWithDetails(
                        orderId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy đơn hàng có ID: "
                                        + orderId
                        )
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
                        ||
                        !authentication.isAuthenticated()
                        ||
                        "anonymousUser".equals(
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
                .findByUsername(
                        username
                )
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


        return normalized.isEmpty()
                ? null
                : normalized;
    }


    // ==================================================
    // VALIDATE CREATE
    // ==================================================

    private void validateCreateOrderRequest(
            CreateOrderRequest request
    ) {

        EOrderType type =
                request.getOrderType();


        // ==================================================
        // DINE IN
        // ==================================================

        if (
                type
                        == EOrderType.DINE_IN
        ) {

            if (
                    request.getTableId()
                            == null
            ) {

                throw new InvalidOperationException(
                        "Đơn tại bàn bắt buộc phải chọn bàn."
                );
            }


            if (
                    request.getShippingDetail()
                            != null
            ) {

                throw new InvalidOperationException(
                        "Đơn tại bàn không được chứa thông tin giao hàng."
                );
            }


            return;
        }


        // ==================================================
        // TAKE AWAY
        // ==================================================

        if (
                type
                        == EOrderType.TAKE_AWAY
        ) {

            if (
                    request.getTableId()
                            != null
            ) {

                throw new InvalidOperationException(
                        "Đơn mang về không được gắn với bàn ăn."
                );
            }


            if (
                    request.getShippingDetail()
                            != null
            ) {

                throw new InvalidOperationException(
                        "Đơn mang về không cần thông tin giao hàng."
                );
            }


            return;
        }


        // ==================================================
        // DELIVERY
        // ==================================================

        if (
                type
                        == EOrderType.DELIVERY
        ) {

            if (
                    request.getTableId()
                            != null
            ) {

                throw new InvalidOperationException(
                        "Đơn giao hàng không được gắn với bàn ăn."
                );
            }


            if (
                    request.getShippingDetail()
                            == null
            ) {

                throw new InvalidOperationException(
                        "Đơn giao hàng bắt buộc phải có thông tin người nhận."
                );
            }


            return;
        }


        throw new InvalidOperationException(
                "Loại đơn hàng không hợp lệ."
        );
    }
}