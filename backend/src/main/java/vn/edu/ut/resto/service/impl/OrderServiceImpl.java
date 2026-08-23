package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /*
     * Các trạng thái cho biết Order
     * vẫn chưa kết thúc.
     */
    private static final Set<EOrderStatus>
            ACTIVE_ORDER_STATUSES =
            EnumSet.of(
                    EOrderStatus.PENDING,
                    EOrderStatus.PROCESSING,
                    EOrderStatus.AWAITING_PAYMENT
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
        if (
                request.getOrderType()
                        != EOrderType.DINE_IN
        ) {

            throw new InvalidOperationException(
                    "Hiện tại chức năng tạo đơn chỉ hỗ trợ đơn tại bàn."
            );
        }

        if (request.getTableId() == null) {
            throw new InvalidOperationException(
                    "Đơn tại chỗ bắt buộc phải chọn bàn."
            );
        }


        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy bàn có ID: " + request.getTableId())
                );

        if (table.getStatus() != ETableStatus.AVAILABLE) {
            throw new InvalidOperationException(
                    "Bàn " + table.getTableNumber() + " hiện không khả dụng."
            );
        }

        if (orderRepository.existsByTable_IdAndStatusIn(table.getId(), ACTIVE_ORDER_STATUSES)) {
            throw new InvalidOperationException(
                    "Bàn " + table.getTableNumber() + " đang có đơn hàng chưa hoàn tất."
            );
        }

        User currentUser = getCurrentUser();

        Order order = orderMapper.toEntity(request);

        order.setUser(currentUser);

        order.setTable(table);

        order.setStatus(EOrderStatus.PENDING);



        List<OrderItem> orderItems = new ArrayList<>();

        double totalPrice = 0D;


        for (OrderItemRequest itemRequest : request.getItems()){
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy sản phẩm có ID: " + itemRequest.getProductId())
                    );


            if (product.getStatus() != EProductStatus.AVAILABLE) {
                throw new InvalidOperationException(
                        "Món " + product.getName() + " hiện không thể gọi."
                );
            }

            OrderItem orderItem = new OrderItem();

            orderItem.setPrice(product.getPrice());

            orderItem.setQuantity(itemRequest.getQuantity());

            orderItem.setNote(normalizeNote(itemRequest.getNote()));

            orderItem.setStatus(EOrderItemStatus.PENDING);

            orderItem.setProduct(product);

            orderItem.setOrder(order);


            orderItems.add(orderItem);

            totalPrice += product.getPrice() * itemRequest.getQuantity();
        }

        order.setOrderItems(orderItems);

        order.setTotalPrice(totalPrice);

        order.setNote(normalizeNote(order.getNote()));

        table.setStatus(ETableStatus.OCCUPIED);

        Order savedOrder = orderRepository.save(order);

        tableRepository.save(table);
        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public Order getActiveOrderByTable(
            Long tableId
    ) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy bàn có ID: " + tableId));

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

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())
        ) {

            throw new UnauthorizedException(
                    "Người dùng chưa đăng nhập."
            );
        }


        String username =
                authentication.getName();


        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                                "Không tìm thấy tài khoản đang đăng nhập."));
    }


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