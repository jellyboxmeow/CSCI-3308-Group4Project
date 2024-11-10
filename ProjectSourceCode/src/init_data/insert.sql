-- INSERT test cards --
INSERT INTO cards(id, card_name, card_image, card_rarity, card_price, card_set) VALUES (1, 'test-charizard', 'cat.png', 'epic', 20.32, 'base');
INSERT INTO cards(id, card_name, card_image, card_rarity, card_price, card_set) VALUES (2, 'test-squirtle', 'dog.png', 'rare', 0.34, 'base');

-- INSERT test deck --
INSERT INTO deck(id, cards, cards2) VALUES (1, 1, 2);

--- INSERT test user---
INSERT INTO users(username, password, status, deck_id) VALUES ('test', 'test', 'admin', 1);

--- INSERT test community form ---
INSERT INTO form_comments(form_comments_id, content, comment_date) VALUES (1, 'test comment', '11/3/2024');
INSERT INTO community_forms(community_forms_id, form_name, form_type, form_description, form_user, form_date, form_comments_id) VALUES (1, 'test form', 'test type', 'test description', 1, '11/3/2024', 1);
-- INSERT INTO form_comments(id, form_id, content, comment_date, comment_user) VALUES (1, 1, 'test comment', '11/3/2024', 1);
-- INSERT INTO community_forms(id, form_name, form_type, form_description, form_date) VALUES (1, 'test form', 'test type', 'test description', '11/3/2024');


--- INSERT test deck values ---