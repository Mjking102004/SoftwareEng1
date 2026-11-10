const pool = require('../db/db');

//get all books with their category name
const getBooks = async (req, res) => {
    try{
        const result = await pool.query(
            `SELECT b.*, c.name AS category
             FROM books b
             LEFT JOIN categories c ON b.category_id = c.category_id
             ORDER BY b.book_id`
        );
        res.status(200).json(result.rows);
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

//add a new book
const createBook = async (req, res) => {
    try{
        const {title, author, description, price, quantity, image_url, category_id} = req.body;
        const result = await pool.query(
            `INSERT INTO books (title, author, description, price, quantity, image_url, category_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, author, description || null, price, quantity, image_url || null, category_id || null]
        );
        res.status(201).json(result.rows[0]);
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

//update a book
const updateBook = async (req, res) => {
    try{
        const {title, author, description, price, quantity, image_url, category_id} = req.body;
        const result = await pool.query(
            `UPDATE books
             SET title = $1, author = $2, description = $3, price = $4, quantity = $5,
             image_url = $6, category_id = $7
             WHERE book_id = $8
             RETURNING *`,
            [title, author, description || null, price, quantity, image_url || null, category_id || null, req.params.id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({error: "Book not found."});
        }
        res.status(200).json(result.rows[0]);
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

//delete a book
const deleteBook = async (req, res) => {
    try{
        await pool.query("DELETE FROM books WHERE book_id = $1", [req.params.id]);
        res.status(200).json({message: 'Book deleted.'});
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

//get all categories
const getCategories = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM categories ORDER BY name");
        res.status(200).json(result.rows);
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

module.exports = {getBooks, createBook, updateBook, deleteBook, getCategories};