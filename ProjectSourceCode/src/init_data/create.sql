--- TODO: Create a session management table, Users, Login, etc. ---
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL

);

---TODO: Create a table for friends ---
CREATE TABLE IF NOT EXISTS friends(
    user_id INT FOREIGN KEY,
    friend_id INT FOREIGN KEY
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