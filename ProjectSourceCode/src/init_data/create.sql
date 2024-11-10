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