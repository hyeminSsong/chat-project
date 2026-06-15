package com.example.chat.service;

import com.example.chat.dto.ChatRoomResponse;
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

    public List<ChatRoomResponse> getChatRooms(String userId) {
        return chatRoomMemberRepository.findChatRoomsByUserId(userId);
    }
}
