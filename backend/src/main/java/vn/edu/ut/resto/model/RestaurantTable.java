package vn.edu.ut.resto.model;

import jakarta.persistence.*;
import vn.edu.ut.resto.model.enums.ETableStatus;

@Entity
@Table(name = "tables")
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tableNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ETableStatus status;

    @Column(nullable = false, unique = true)
    private String qrToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    public RestaurantTable() {
    }


    public RestaurantTable(
            String tableNumber,
            ETableStatus status,
            Area area
    ) {
        this.tableNumber = tableNumber;
        this.status = status;
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

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }
}