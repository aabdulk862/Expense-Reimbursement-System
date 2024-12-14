package com.revature.models;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

@Component //1 of the 4 stereotype annotations (makes the class a Bean)
@Entity //This annotation makes a DB table based on this Class
@Table(name = "reimbursement") //This annotation lets us specify properties (like table name)
public class Reimbursement {
    @Id //This annotation makes the field a primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //This makes our PK auto-increment integers
    private int reimId;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private double amount;
    @Column(nullable = false)
    private String status;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId", nullable = false) //This links our FK to the PK in User (UserId)
    private User user;

    public Reimbursement() {
    }

    public Reimbursement(int reimId, String description, double amount, String status, User user) {
        this.reimId = reimId;
        this.description = description;
        this.amount = amount;
        this.status = status;
        this.user = user;
    }


    public int getReimId() {
        return reimId;
    }

    public void setReimId(int reimId) {
        this.reimId = reimId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Reimbursement{" +
                "reimId=" + reimId +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", status='" + status + '\'' +
                ", user=" + user +
                '}';
    }
}
