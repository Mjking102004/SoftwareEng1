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

module.exports = {getBooks};