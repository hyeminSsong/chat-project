CREATE TABLE IF NOT EXISTS users (
    user_id        VARCHAR(50) PRIMARY KEY,
    user_name      VARCHAR(100),
    profile_url    VARCHAR(255),
    status_cd      VARCHAR(20),
    department_cd  VARCHAR(20),
    position_cd    VARCHAR(20),
    ins_dtm        TIMESTAMP,
    upd_dtm        TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_room (
    room_id          VARCHAR(50) PRIMARY KEY,
    room_type_cd     VARCHAR(20),
    room_name        VARCHAR(100),
    description      VARCHAR(500),
    notice           VARCHAR(500),
    last_message_id  VARCHAR(50),
    last_sender_id   VARCHAR(50),
    last_send_dtm    TIMESTAMP,
    ins_id           VARCHAR(50),
    ins_dtm          TIMESTAMP,
    upd_id           VARCHAR(50),
    upd_dtm          TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_room_member (
    room_id               VARCHAR(50) NOT NULL REFERENCES chat_room(room_id),
    user_id               VARCHAR(50) NOT NULL REFERENCES users(user_id),
    ins_dtm               TIMESTAMP,
    ins_id                VARCHAR(50),
    last_read_message_id  VARCHAR(50),
    room_alias            VARCHAR(100),
    pinned_yn             VARCHAR(1),
    pinned_dtm            TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);
