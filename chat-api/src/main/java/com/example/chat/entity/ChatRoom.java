package com.example.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
@Getter
@NoArgsConstructor
public class ChatRoom {

    @Id
    @Column(name = "room_id")
    private String roomId;

    @Column(name = "room_type_cd")
    private String roomTypeCd;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "description")
    private String description;

    @Column(name = "notice")
    private String notice;

    @Column(name = "last_message_id")
    private String lastMessageId;

    @Column(name = "last_sender_id")
    private String lastSenderId;

    @Column(name = "last_send_dtm")
    private LocalDateTime lastSendDtm;

    @Column(name = "ins_id")
    private String insId;

    @Column(name = "ins_dtm")
    private LocalDateTime insDtm;

    @Column(name = "upd_id")
    private String updId;

    @Column(name = "upd_dtm")
    private LocalDateTime updDtm;
}
