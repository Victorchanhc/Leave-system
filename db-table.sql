INSERT INTO users (name,email,phone,password) VALUES ('sonic','pk123@gmail.com','64800144','123456');

SELECT * FROM users

SELECT * FROM users where updated_at = null

SELECT * FROM players

--\d+

DELETE FROM participants WHERE id > 2;

CREATE TABLE players (
    id SERIAL primary key,
    english_name VARCHAR(255) not null,
    nick_name VARCHAR(255) not null,
    chinese_name VARCHAR(255),
    date_of_birth DATE not null,
    gender VARCHAR(255) not null,
    parent_id INT not null,
    FOREIGN KEY (parent_id) REFERENCES users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
    );

   DROP TABLE request_lesson;


CREATE TABLE lessons (
    id SERIAL primary key,
    name VARCHAR(255) not null,
    date DATE not null,
    start_time TIME not null,
    end_time TIME not null,
    venus VARCHAR(255) not null,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
);

SELECT * FROM lessons

SELECT * FROM lessons WHERE name = '星期六 下午 荃灣' AND start_time = '14:30:00';

DELETE FROM lessons WHERE id = 7

ALTER TABLE lessons RENAME COLUMN venus TO venue;

INSERT INTO lessons (name, date, start_time, end_time, venue) VALUES ('星期日 下午 荃灣','2024-04-01','11:30:00','13:00:00','城門谷五人場')

CREATE TABLE participants(
    id SERIAL primary key,
    player_id INT not null,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    lesson_id INT not null,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    request_lesson_id INT,
    FOREIGN KEY (request_lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    reason varchar(255),
    status varchar(255) not null DEFAULT 'DEFAULT',
    attendant BOOLEAN DEFAULT FALSE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
)

SELECT * FROM participants

DROP TABLE participants;

INSERT INTO participants (player_id, lesson_id) VALUES (1,10)

SELECT * FROM lessons 
	INNER JOIN participants 
		ON lessons.id = participants.lesson_id
	INNER JOIN players 
		ON players.id = participants.player_id
	WHERE players.id = '1';

    SELECT * FROM teachers 
	INNER JOIN teacher_students 
		ON teachers.id = teacher_students.teacher_id
	INNER JOIN students 
		ON students.id = teacher_students.student_id
	WHERE teachers.name = 'Bob';

    SELECT participants.id, lessons.name, lessons.date, lessons.start_time, lessons.end_time, lessons.venue, participants.player_id, players.english_name, players.nick_name FROM lessons 
            INNER JOIN participants 
                ON lessons.id = participants.lesson_id
            INNER JOIN players 
                ON players.id = participants.player_id
        WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = 'pk123@gmail.com') AND lessons.date > NOW()
        ORDER BY player_id,date;

CREATE TABLE request_lesson(
    id SERIAL primary key,
    player_id INT not null,
    FOREIGN KEY (player_id) REFERENCES players(id),
    origin_lesson_id INT not null,
    FOREIGN KEY (origin_lesson_id) REFERENCES lessons(id),
    apply_lesson_id INT not null,
    FOREIGN KEY (apply_lesson_id) REFERENCES lessons(id),
    reason varchar(255) not null ,
    status varchar(255) not null DEFAULT 'PENDING',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
)

DROP TABLE request_lesson;

SELECT * FROM request_lesson;

-- get apply
SELECT request_lesson.id, request_lesson.player_id, lessons.name, lessons.date, lessons.start_time, lessons.end_time, lessons.venue, status FROM request_lesson 
INNER JOIN participants
    ON participant_id = participants.id
INNER JOIN lessons
    ON lessons.id = request_lesson.lesson_id
INNER JOIN players
    ON players.id = request_lesson.player_id
WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = 'pk123@gmail.com')



-- get origin
SELECT request_lesson.id, request_lesson.player_id, lessons.name, lessons.date, lessons.start_time, lessons.end_time, lessons.venue, status FROM request_lesson 
            INNER JOIN lessons
                ON apply_lesson_id = lessons.id
            INNER JOIN players
                ON player_id = players.id
            INNER JOIN participants
                ON player_id = (SELECT player_id FROM participants)


SELECT participants.id, participants.request_lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status FROM lessons 
            INNER JOIN participants 
                ON lessons.id = participants.request_lesson_id
            INNER JOIN players 
                ON players.id = participants.player_id
        WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = 'pk123@gmail.com') AND lessons.date > NOW() AND participants.status != 'DEFAULT'
            ORDER BY player_id,date ;


-- get all request

SELECT participants.id, participants.request_lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status FROM lessons 
    INNER JOIN participants 
        ON lessons.id = participants.request_lesson_id
    INNER JOIN players 
        ON players.id = participants.player_id
WHERE participants.status != 'DEFAULT'
    ORDER BY player_id,date ;

-- get all request origin lesson info

SELECT participants.id, participants.lesson_id, participants.request_lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status FROM lessons 
    INNER JOIN participants 
        ON lessons.id = participants.lesson_id
    INNER JOIN players 
        ON players.id = participants.player_id
WHERE participants.status != 'DEFAULT'
    ORDER BY player_id,date ;

SELECT participants.id, participants.lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status, participants.attendant FROM lessons 
    INNER JOIN participants 
        ON lessons.id = participants.lesson_id
    INNER JOIN players 
        ON players.id = participants.player_id
    ORDER BY name,date,start_time,status,player_id

SELECT * FROM participants

UPDATE participants SET attendant = true WHERE id = 2;