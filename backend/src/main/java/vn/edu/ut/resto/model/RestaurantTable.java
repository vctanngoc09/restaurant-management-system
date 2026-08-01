package vn.edu.ut.resto.model;

import jakarta.persistence.*;
import vn.edu.ut.resto.model.enums.ETableStatus;

@Entity
@Table(name = "tables") // Tránh trùng từ khóa SQL
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tableNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ETableStatus status;

    private String qrUrl;

    // Quan hệ N Bàn thuộc về 1 Khu vực
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    public RestaurantTable() {
    }

    public RestaurantTable(String tableNumber, ETableStatus status, String qrUrl, Area area) {
        this.tableNumber = tableNumber;
        this.status = status;
        this.qrUrl = qrUrl;
        this.area = area;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public ETableStatus getStatus() {
        return status;
    }

    public void setStatus(ETableStatus status) {
        this.status = status;
    }

    public String getQrUrl() {
        return qrUrl;
    }

    public void setQrUrl(String qrUrl) {
        this.qrUrl = qrUrl;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }
}