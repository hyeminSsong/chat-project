package com.example.chat.controller;

import com.example.chat.entity.User;
import com.example.chat.entity.ChatRoomMember;
import com.example.chat.repository.ChatRoomMemberRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final EntityManager em;

    // DB에 존재하는 user_id 목록 확인용 (확인 후 삭제 예정)
    @GetMapping("/users")
    public List<String> getUsers() {
        return em.createQuery("SELECT u.userId FROM User u", String.class).getResultList();
    }

    @GetMapping("/members")
    public List<String> getMembers() {
        return em.createQuery("SELECT DISTINCT crm.id.userId FROM ChatRoomMember crm", String.class).getResultList();
    }
}
