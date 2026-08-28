package vn.edu.ut.resto.model;

import jakarta.persistence.*;

import vn.edu.ut.resto.model.enums.EKitchenTicketStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(
        name = "kitchen_tickets",

        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_kitchen_ticket_order_batch",
                        columnNames = {
                                "order_id",
                                "batch_number"
                        }
                )
        },

        indexes = {
                @Index(
                        name = "idx_kitchen_ticket_status_fired",
                        columnList = "status, fired_at"
                )
        }
)
public class KitchenTicket {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    // ==================================================
    // BATCH NUMBER
    //
    // Order #10:
    // batch 1 = món gọi ban đầu
    // batch 2 = gọi thêm lần 1
    // batch 3 = gọi thêm lần 2
    // ==================================================

    @Column(
            name = "batch_number",
            nullable = false
    )
    private Integer batchNumber;


    // ==================================================
    // STATUS
    // ==================================================

    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false,
            length = 20
    )
    private EKitchenTicketStatus status;


    // ==================================================
    // TIME
    // ==================================================

    @Column(
            name = "fired_at",
            nullable = false
    )
    private LocalDateTime firedAt;


    @Column(
            name = "started_at"
    )
    private LocalDateTime startedAt;


    @Column(
            name = "ready_at"
    )
    private LocalDateTime readyAt;


    @Column(
            name = "done_at"
    )
    private LocalDateTime doneAt;


    // ==================================================
    // ORDER
    // ==================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;


    // ==================================================
    // ITEMS
    // ==================================================

    @OneToMany(mappedBy = "kitchenTicket")
    private List<OrderItem> items =
            new ArrayList<>();


    public KitchenTicket() {

        this.status =
                EKitchenTicketStatus.WAITING;

        this.firedAt =
                LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }


    public Integer getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(
            Integer batchNumber
    ) {
        this.batchNumber =
                batchNumber;
    }


    public EKitchenTicketStatus getStatus() {
        return status;
    }

    public void setStatus(
            EKitchenTicketStatus status
    ) {
        this.status =
                status;
    }


    public LocalDateTime getFiredAt() {
        return firedAt;
    }

    public void setFiredAt(
            LocalDateTime firedAt
    ) {
        this.firedAt =
                firedAt;
    }


    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(
            LocalDateTime startedAt
    ) {
        this.startedAt =
                startedAt;
    }


    public LocalDateTime getReadyAt() {
        return readyAt;
    }

    public void setReadyAt(
            LocalDateTime readyAt
    ) {
        this.readyAt =
                readyAt;
    }


    public LocalDateTime getDoneAt() {
        return doneAt;
    }

    public void setDoneAt(
            LocalDateTime doneAt
    ) {
        this.doneAt =
                doneAt;
    }


    public Order getOrder() {
        return order;
    }

    public void setOrder(
            Order order
    ) {
        this.order =
                order;
    }


    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(
            List<OrderItem> items
    ) {
        this.items =
                items;
    }
}