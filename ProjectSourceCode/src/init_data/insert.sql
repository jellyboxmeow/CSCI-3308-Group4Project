--- INSERT test user---
INSERT INTO users(id, username, password) VALUES (1, 'test', 'test');

--- INSERT test community form ---
INSERT INTO community_forms(id, form_name, form_type, form_description, form_user, form_date, form_comments) VALUES (1, 'test form', 'test type', 'test description', 1, '11/3/2024', 1);
INSERT INTO form_comments(id, form_id, content, comment_date, comment_user) VALUES (1, 1, 'test comment', '11/3/2024', 1);

--- INSERT test deck values ---