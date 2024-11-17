--- TODO: Create a session management table, Users, Login, etc. ---
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    status VARCHAR(50) NOT NULL
    deck_id INT FOREIGN KEY REFERENCES deck(id)
);

---TODO: Create a table for friends ---
CREATE TABLE IF NOT EXISTS friends(
    user_id INT FOREIGN KEY REFERENCES users(id),
    friend_id INT FOREIGN KEY REFERENCES users(id),
);

--- TODO: Create table(s) for Community Forms ---
CREATE TABLE IF NOT EXISTS community_forms(
    id INT PRIMARY KEY,
    form_name VARCHAR(255) NOT NULL,
    form_type VARCHAR(50) NOT NULL,
    form_description TEXT,
    form_user INT FOREIGN KEY,
    form_date DATE,
    form_comments INT FOREIGN KEY
);

CREATE TABLE IF NOT EXISTS form-comments(
    id INT PRIMARY KEY,
    form_id INT FOREIGN KEY,
    content TEXT,
    comment_date DATE,
    comment_user FOREIGN KEY
);

--- TODO: Create a table for Deck value ---
CREATE TABLE IF NOT EXISTS deck(
    id INT PRIMARY KEY,
    cards SET FOREIGN KEY REFERENCES cards(id),
    cards2 SET FOREIGN KEY REFERENCES cards(id)
);

CREATE TABLE IF NOT EXISTS cards(
    id INT PRIMARY KEY,
    card_name VARCHAR(255) NOT NULL,
    card_image VARCHAR(255) NOT NULL,
    card_rarity VARCHAR(50) NOT NULL,
    card_price DECIMAL(10, 2) NOT NULL,
    card_set VARCHAR(255) NOT NULL
);

--- TODO: Create a table for Deck value ---
DROP TABLE IF EXISTS deck CASCADE;
CREATE TABLE IF NOT EXISTS deck(
    id SERIAL PRIMARY KEY,
    cards INT,
    FOREIGN KEY (cards) REFERENCES cards(id) ON DELETE CASCADE,
    cards2 INT,
    FOREIGN KEY (cards2) REFERENCES cards(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users(
    users_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    status VARCHAR(50),
    deck_id INT,
    FOREIGN KEY (deck_id) REFERENCES deck(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS form_comments CASCADE;
CREATE TABLE IF NOT EXISTS form_comments(
    form_comments_id INT PRIMARY KEY,
    -- form_id INT FOREIGN KEY,
    content TEXT,
    comment_date DATE
    -- comment_user FOREIGN KEY
);
 
---TODO: Create a table for friends ---
DROP TABLE IF EXISTS friends CASCADE;
CREATE TABLE IF NOT EXISTS friends(
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(users_id) ON DELETE CASCADE,
    friend_id INT NOT NULL,
    FOREIGN KEY (friend_id) REFERENCES users(users_id) ON DELETE CASCADE
);

ALTER TABLE friends ADD CONSTRAINT unique_friendship UNIQUE (user_id, friend_id);

--- TODO: Create table(s) for Community Forms ---
DROP TABLE IF EXISTS community_forms CASCADE;
CREATE TABLE IF NOT EXISTS community_forms(
    community_forms_id INT PRIMARY KEY,
    form_name VARCHAR(255) NOT NULL,
    form_type VARCHAR(50) NOT NULL,
    form_description TEXT,
    form_user VARCHAR(50) NOT NULL,
    FOREIGN KEY (form_user) REFERENCES users (username) ON DELETE CASCADE,
    form_date DATE,
    form_comments_id INT NOT NULL,
    FOREIGN KEY (form_comments_id) REFERENCES form_comments (form_comments_id) ON DELETE CASCADE
);