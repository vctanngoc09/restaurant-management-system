package vn.edu.ut.resto.model;

import jakarta.persistence.*;

import vn.edu.ut.resto.model.enums.EProductStatus;


@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private Double price;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EProductStatus status;


    private String urlImg;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;


    public Product() {
    }


    public Product(
            String name,
            Double price,
            EProductStatus status,
            String urlImg,
            Category category
    ) {

        this.name = name;

        this.price = price;

        this.status = status;

        this.urlImg = urlImg;

        this.category = category;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public Double getPrice() {
        return price;
    }


    public void setPrice(Double price) {
        this.price = price;
    }


    public EProductStatus getStatus() {
        return status;
    }


    public void setStatus(EProductStatus status) {
        this.status = status;
    }


    public String getUrlImg() {
        return urlImg;
    }


    public void setUrlImg(String urlImg) {
        this.urlImg = urlImg;
    }


    public Category getCategory() {
        return category;
    }


    public void setCategory(Category category) {
        this.category = category;
    }
}