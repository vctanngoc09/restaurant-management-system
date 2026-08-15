package vn.edu.ut.resto.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 500)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spender_id")
    private User spender;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Expense() {
    }


    public Expense(
            LocalDate expenseDate,
            String category,
            Double amount,
            String note,
            User spender
    ) {

        this.expenseDate = expenseDate;
        this.category = category;
        this.amount = amount;
        this.note = note;
        this.spender = spender;
    }

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        if (expenseDate == null) {
            expenseDate = LocalDate.now();
        }
    }

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getExpenseDate() {
        return expenseDate;
    }


    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }


    public String getCategory() {
        return category;
    }


    public void setCategory(String category) {
        this.category = category;
    }


    public Double getAmount() {
        return amount;
    }


    public void setAmount(Double amount) {
        this.amount = amount;
    }


    public String getNote() {
        return note;
    }


    public void setNote(String note) {
        this.note = note;
    }


    public User getSpender() {
        return spender;
    }


    public void setSpender(User spender) {
        this.spender = spender;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}