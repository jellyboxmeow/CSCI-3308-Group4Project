-- INSERT test cards --
INSERT INTO cards(id, card_name, card_image, card_rarity, card_price, card_set) VALUES (1, 'Pikachu', 'https://images.pokemontcg.io/basep/1_hires.png', 'Promo', 10.76, 'Wizards Black Star Promos');
INSERT INTO cards(id, card_name, card_image, card_rarity, card_price, card_set) VALUES (2, 'Pikachu', 'https://images.pokemontcg.io/mcd19/6_hires.png', 'N/As', 5.27, 'McDonalds Collection 2019');
-- INSERT test deck --
INSERT INTO deck DEFAULT VALUES;
INSERT INTO deck DEFAULT VALUES;

INSERT INTO deck_cards(deck_id, card_id) VALUES (1, 1);
INSERT INTO deck_cards(deck_id, card_id) VALUES (2, 2);

--- INSERT test user---
--- INSERT test community form ---

INSERT INTO users(username, password, status) VALUES ('test', '$2a$10$R4vo/AjcXE5JS0hiJoMPVO7olqCfwMdmM0dWNe7iHPBirtivx/xrC', 'admin') RETURNING users_id, deck_id;
INSERT INTO users(username, password) VALUES ('test1', '$2a$10$EgM6nmoF/am09.xLhLb.ieRkHy//UG1lFiH21kARTgoBIMmPBL8Mq');


-- INSERT INTO form_comments(form_comments_id, content, comment_date) VALUES (1, 'test comment', '11/3/2024');
-- INSERT INTO community_forms(community_forms_id, form_name, form_type, form_description, form_user, form_date, form_comments_id) VALUES (1, 'test form', 'test type', 'test description', 'test', '11/3/2024', 1);
INSERT INTO community_forms(community_forms_id, form_name, form_type, form_description, form_user, form_date) VALUES (0, 'test form', 'test type', 'test description', 'test', '2024-11-03');
-- INSERT INTO form_comments(id, form_id, content, comment_date, comment_user) VALUES (1, 1, 'test comment', '11/3/2024', 1);
-- INSERT INTO community_forms(id, form_name, form_type, form_description, form_date) VALUES (1, 'test form', 'test type', 'test description', '11/3/2024');

-- INSERT friends --
INSERT INTO friends(user_id, friend_id) VALUES (1, 2);
-- INSERT INTO friends(user_id, friend_id) VALUES (1, 3);

--- INSERT test deck values ---