package vn.edu.ut.resto.model;

import jakarta.persistence.*;
import vn.edu.ut.resto.model.enums.EOrderItemStatus;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    private String note;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EOrderItemStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kitchen_ticket_id")
    private KitchenTicket kitchenTicket;

    public OrderItem() {}

    public OrderItem(Double price, Integer quantity, String note, EOrderItemStatus status, Order order, Product product) {
        this.price = price;
        this.quantity = quantity;
        this.note = note;
        this.status = status;
        this.order = order;
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public EOrderItemStatus getStatus() {
        return status;
    }

    public void setStatus(EOrderItemStatus status) {
        this.status = status;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public KitchenTicket getKitchenTicket() {
        return kitchenTicket;
    }

    public void setKitchenTicket(KitchenTicket kitchenTicket) {
        this.kitchenTicket = kitchenTicket;
    }
}