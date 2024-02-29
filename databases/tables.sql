

CREATE TABLE users(
    id serial primary key,
    name varchar(255),
    phone varchar(255),
    email varchar(255) not null,
    password varchar(255) not null,
    roles varchar(255) not null DEFAULT 'PARENT',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
);

CREATE TABLE lessons (
    id SERIAL primary key,
    name VARCHAR(255) not null,
    date DATE not null,
    start_time TIME not null,
    end_time TIME not null,
    venue VARCHAR(255) not null,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
);

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
);
