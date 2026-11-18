-- Run the following command once to insert sample data to your existing database:
-- docker compose exec -T db psql -U postgres -d database < backend/src/db/sampleData.sql

-- Inserts the database with: 
-- 5 sample categories
-- 10 sample books (1 out of stock)
-- 3 sample discount codes (2 Active, 1 Expired)
-- 3 sample sales (1 Current, 1 Past, 1 Future)

BEGIN;

--Insert Sample Categories

INSERT INTO categories (name)
VALUES 
('Fiction'),
('Science'),
('Technology'),
('History'),
('Business')
ON CONFLICT (name) DO NOTHING;


-- Insert Sample Books

-- 'The Great Gatsby'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'The Great Gatsby',
'F. Scott Fitzgerald',
'A classic novel about wealth, love, and the American dream.',
14.99,
8,
'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Fiction')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'The Great Gatsby');

-- '1984'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'1984',
'George Orwell',
'A dystopian novel about government surveillance and control.',
12.99,
3,
'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Fiction')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '1984');

-- 'A Breif History of Time'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'A Brief History of Time',
'Stephen Hawking',
'An introduction to cosmology and the universe.',
18.99,
10,
'https://pictures.abebooks.com/isbn/9780553053401-us._FMavif_.jpg',
(SELECT category_id FROM categories WHERE name = 'Science')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'A Brief History of Time');

-- 'The Selfish Gene'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'The Selfish Gene',
'Richard Dawkins',
'A popular science book exploring evolution and genetics.',
16.99,
5,
'https://covers.openlibrary.org/b/id/7891217-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Science')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'The Selfish Gene');

-- 'Clean Code'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'Clean Code',
'Robert C. Martin',
'A guide to writing maintainable software and professional code.',
34.99,
12,
'https://covers.openlibrary.org/b/id/15126503-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Technology')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Clean Code');

-- 'Design Patterns'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'Design Patterns',
'Erich Gamma',
'Classic software engineering design patterns and architecture principles.',
39.99,
6,
'https://ia600404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_82.zip&file=0010827044-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Technology')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Design Patterns');

-- 'Sapiens'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'Sapiens',
'Yuval Noah Harari',
'A brief history of humankind from ancient times to the present.',
21.99,
9,
'https://covers.openlibrary.org/b/id/15253569-L.jpg',
(SELECT category_id FROM categories WHERE name = 'History')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Sapiens');

-- 'Guns, Germs, and Steel'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'Guns, Germs, and Steel',
'Jared Diamond',
'An examination of the forces that shaped civilizations.',
19.99,
0,
'https://pictures.abebooks.com/isbn/9780393354324-us.jpg',
(SELECT category_id FROM categories WHERE name = 'History')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Guns, Germs, and Steel');

-- 'The Intelligent Investor'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'The Intelligent Investor',
'Benjamin Graham',
'A foundational book on value investing.',
24.99,
7,
'https://ia800404.us.archive.org/view_archive.php?archive=/33/items/l_covers_0010/l_covers_0010_82.zip&file=0010826961-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Business')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'The Intelligent Investor');

-- 'Rich Dad Poor Dad'
INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
SELECT
'Rich Dad Poor Dad',
'Robert Kiyosaki',
'A personal finance and investing classic.',
15.99,
1,
'https://ia902809.us.archive.org/view_archive.php?archive=/18/items/l_covers_0008/l_covers_0008_71.zip&file=0008715673-L.jpg',
(SELECT category_id FROM categories WHERE name = 'Business')
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Rich Dad Poor Dad');


--Insert Sample Discount Codes

INSERT INTO discount_codes (code, discount_percent, active)
VALUES
('ROWDY10', 10, TRUE),
('WELCOME15', 15, TRUE),
('EXPIRED20', 20, FALSE)
ON CONFLICT DO NOTHING;


--Insert Sample Sales

--Active sale
INSERT INTO sales (book_id, sale_price, starts_at, ends_at, active)
SELECT
(SELECT book_id FROM books WHERE title = 'The Great Gatsby'),
11.99,
NOW(),
NOW() + INTERVAL '30 days',
TRUE
WHERE NOT EXISTS 
(
    SELECT 1
    FROM sales
    WHERE book_id = (SELECT book_id FROM books WHERE title = 'The Great Gatsby')
);

-- Past sale
INSERT INTO sales (book_id, sale_price, starts_at, ends_at, active)
SELECT
(SELECT book_id FROM books WHERE title = '1984'),
9.99,
NOW() - INTERVAL '60 days',
NOW() - INTERVAL '30 days',
FALSE
WHERE NOT EXISTS 
(
    SELECT 1
    FROM sales
    WHERE book_id = (SELECT book_id FROM books WHERE title = '1984')
);

--Future sale
INSERT INTO sales (book_id, sale_price, starts_at, ends_at, active)
SELECT
(SELECT book_id FROM books WHERE title = 'The Intelligent Investor'),
19.99,
NOW() + INTERVAL '15 days',
NOW() + INTERVAL '45 days',
TRUE
WHERE NOT EXISTS 
(
    SELECT 1
    FROM sales
    WHERE book_id = (SELECT book_id FROM books WHERE title = 'The Intelligent Investor')
);

COMMIT;