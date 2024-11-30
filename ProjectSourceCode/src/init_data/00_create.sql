-- Drop and recreate the `cards` table
DROP TABLE IF EXISTS cards CASCADE;
CREATE TABLE IF NOT EXISTS cards(
    id VARCHAR(25) PRIMARY KEY,
    card_name VARCHAR(255) NOT NULL,
    card_image VARCHAR(255) NOT NULL,
    card_rarity VARCHAR(50) NOT NULL,
    card_price DECIMAL(10, 2) NOT NULL,
    card_set VARCHAR(255) NOT NULL
);

-- Drop and recreate the `deck` table
DROP TABLE IF EXISTS deck CASCADE;
CREATE TABLE IF NOT EXISTS deck(
    deck_id SERIAL PRIMARY KEY
);

DROP TABLE IF EXISTS deck_cards CASCADE;
CREATE TABLE IF NOT EXISTS deck_cards(
    deck_id INT NOT NULL,
    card_id VARCHAR(25) NOT NULL,
    row_index SERIAL,
    FOREIGN KEY (deck_id) REFERENCES deck(deck_id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users(
    users_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    status VARCHAR(50),
    deck_id SERIAL NOT NULL,
    FOREIGN KEY (deck_id) REFERENCES deck(deck_id) ON DELETE CASCADE
);

-- -- Drop and recreate the `form_comments` table
-- DROP TABLE IF EXISTS form_comments CASCADE;
-- CREATE TABLE IF NOT EXISTS form_comments(
--     form_comments_id INT PRIMARY KEY,
--     content TEXT,
--     comment_date DATE
-- );

-- Drop and recreate the `friends` table
DROP TABLE IF EXISTS friends CASCADE;
CREATE TABLE IF NOT EXISTS friends(
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(users_id) ON DELETE CASCADE,
    friend_id INT NOT NULL,
    FOREIGN KEY (friend_id) REFERENCES users(users_id) ON DELETE CASCADE
);

ALTER TABLE friends ADD CONSTRAINT unique_friendship UNIQUE (user_id, friend_id);

-- Drop and recreate the `community_forms` table with `form_user` referencing `username`
DROP TABLE IF EXISTS community_forms CASCADE;
CREATE TABLE IF NOT EXISTS community_forms(
    community_forms_id SERIAL PRIMARY KEY,
    form_name VARCHAR(255) NOT NULL,
    form_type VARCHAR(50) NOT NULL,
    form_description TEXT,
    form_user VARCHAR(50) NOT NULL,
    FOREIGN KEY (form_user) REFERENCES users (username) ON DELETE CASCADE,
    form_date DATE DEFAULT CURRENT_DATE
    -- form_comments_id INT NOT NULL,
    -- FOREIGN KEY (form_comments_id) REFERENCES form_comments (form_comments_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS trade_cards CASCADE;
CREATE TABLE IF NOT EXISTS trade_cards(
    card_id VARCHAR(25) PRIMARY KEY,
    deck_id INT
)