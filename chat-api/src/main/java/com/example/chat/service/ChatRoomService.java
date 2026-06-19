package com.example.chat.service;

import com.example.chat.dto.response.ChatRoomResponse;
import com.example.chat.repository.ChatRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatRoomService {

    private final ChatRoomMemberRepository chatRoomMemberRepository;

    /** 채팅방 목록 조회 */
    public List<ChatRoomResponse> getChatRooms(String userId) {

        return chatRoomMemberRepository.findChatRoomsByUserId(userId);
    
    }

    /** 채팅방 고정 */
    public void updatePinned(String userId, String roomId, String pinnedYn) {
    
        chatRoomMemberRepository.updatePinned(userId, roomId, pinnedYn);
    
    }

}
