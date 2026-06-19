package com.example.chat.controller;

import com.example.chat.dto.response.ChatRoomResponse;
import com.example.chat.dto.response.PinRoomResponse;
import com.example.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/chatLists")
@Tag(name = "채팅방", description = "채팅방 API")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    /** 채팅방 조회  */
    @GetMapping("/room")
    public ResponseEntity<List<ChatRoomResponse>> getChatRooms(@RequestParam String userId) {

        //로그인 기능 만든 후에 세션 값으로 조회하도록 해야함
        //String userId = (String) session.getAttribute("userId");
        return ResponseEntity.ok(chatRoomService.getChatRooms(userId));
    }

    /** 채팅방 고정 */
    @PatchMapping("/{roomId}/pin")
    @Operation(summary = "채팅방 고정") 
    public ResponseEntity <PinRoomResponse> updatePinned(
            @RequestParam String userId,        
            @PathVariable String roomId,
            @RequestParam String pinnedYn) {

        chatRoomService.updatePinned(userId, roomId, pinnedYn);

        PinRoomResponse responseDto = new PinRoomResponse(true, "채팅방 고정 완료", roomId, pinnedYn);

        return ResponseEntity.ok(responseDto);
            
    }

    

}
