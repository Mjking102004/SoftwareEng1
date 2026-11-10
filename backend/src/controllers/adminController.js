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

//get all categories
const getCategories = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM categories ORDER BY name");
        res.status(200).json(result.rows);
    }catch (err){
        res.status(500).json({error: err.message});
    }
};

module.exports = {getBooks, createBook, getCategories};