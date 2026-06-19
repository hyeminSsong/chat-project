package com.example.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room_member")
@Getter
@NoArgsConstructor
public class ChatRoomMember {

    @EmbeddedId
    private ChatRoomMemberId id;

    @Column(name = "ins_dtm")
    private LocalDateTime insDtm;

    @Column(name = "ins_id")
    private String insId;

    @Column(name = "last_read_message_id")
    private String lastReadMessageId;

    @Column(name = "room_alias")
    private String roomAlias;

    @Column(name = "pinned_yn")
    private String pinnedYn;

    @Column(name = "pinned_dtm")
    private LocalDateTime pinnedDtm;
}
