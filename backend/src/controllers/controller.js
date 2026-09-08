const pool = require('../db/db');

const getItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM temp ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addItem = async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query(
      'INSERT INTO temp (temp_text) VALUES ($1) RETURNING *',
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getItems, addItem };
