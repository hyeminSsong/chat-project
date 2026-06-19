package com.example.chat.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PinRoomResponse {

    private boolean fixSuccess;
    private String message;
    private String roomId;
    private String pinnedYn;

}
