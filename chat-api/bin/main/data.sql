INSERT INTO users (user_id, user_name, status_cd, ins_dtm, upd_dtm) VALUES
    ('U001', '홍길동', 'ONLINE', now(), now()),
    ('U002', '김철수', 'ONLINE', now(), now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO chat_room (room_id, room_type_cd, room_name, last_sender_id, last_send_dtm, ins_dtm, upd_dtm) VALUES
    ('R001', 'GROUP', '일반', 'U002', now(), now(), now())
ON CONFLICT (room_id) DO NOTHING;

INSERT INTO chat_room_member (room_id, user_id, ins_dtm, pinned_yn) VALUES
    ('R001', 'U001', now(), 'N'),
    ('R001', 'U002', now(), 'N')
ON CONFLICT (room_id, user_id) DO NOTHING;
