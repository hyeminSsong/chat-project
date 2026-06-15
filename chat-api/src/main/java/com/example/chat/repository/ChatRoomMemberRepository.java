package com.example.chat.repository;

import com.example.chat.dto.ChatRoomResponse;
import com.example.chat.entity.ChatRoomMember;
import com.example.chat.entity.ChatRoomMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, ChatRoomMemberId> {

    @Query("""
            SELECT new com.example.chat.dto.ChatRoomResponse(
                cr.roomId,
                COALESCE(crm.roomAlias, cr.roomName),
                cr.roomTypeCd,
                cr.lastMessageId,
                cr.lastSenderId,
                cr.lastSendDtm
            )
            FROM ChatRoom cr
            JOIN ChatRoomMember crm ON cr.roomId = crm.id.roomId
            WHERE crm.id.userId = :userId
            ORDER BY cr.lastSendDtm DESC NULLS LAST
            """)
    List<ChatRoomResponse> findChatRoomsByUserId(@Param("userId") String userId);
}
