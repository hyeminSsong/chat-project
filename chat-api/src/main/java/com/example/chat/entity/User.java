package com.example.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "profile_url")
    private String profileUrl;

    @Column(name = "status_cd")
    private String statusCd;

    @Column(name = "department_cd")
    private String departmentCd;

    @Column(name = "position_cd")
    private String positionCd;

    @Column(name = "ins_dtm")
    private LocalDateTime insDtm;

    @Column(name = "upd_dtm")
    private LocalDateTime updDtm;
}
