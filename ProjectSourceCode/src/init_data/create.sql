--- TODO: Create a session management table, Users, Login, etc. ---
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users(
    users_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL
);

---TODO: Create a table for friends ---
-- CREATE TABLE IF NOT EXISTS friends(
--     user_id INT FOREIGN KEY,
--     friend_id INT FOREIGN KEY
-- );

DROP TABLE IF EXISTS form_comments CASCADE;
CREATE TABLE IF NOT EXISTS form_comments(
    form_comments_id INT PRIMARY KEY,
    -- form_id INT FOREIGN KEY,
    content TEXT,
    comment_date DATE
    -- comment_user FOREIGN KEY
);

--- TODO: Create table(s) for Community Forms ---
DROP TABLE IF EXISTS community_forms CASCADE;
CREATE TABLE IF NOT EXISTS community_forms(
    community_forms_id INT PRIMARY KEY,
    form_name VARCHAR(255) NOT NULL,
    form_type VARCHAR(50) NOT NULL,
    form_description TEXT,
    form_user INT NOT NULL,
    FOREIGN KEY (form_user) REFERENCES users (users_id) ON DELETE CASCADE,
    form_date DATE,
    form_comments_id INT NOT NULL,
    FOREIGN KEY (form_comments_id) REFERENCES form_comments (form_comments_id) ON DELETE CASCADE
);

--- TODO: Create a table for Deck value ---