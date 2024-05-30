const express = require('express');
const mysql = require('mysql2');
const util = require('util');
const cors = require('cors')
const app = express();
const port = 3306;

app.use(cors());   //Cross origin resource sharing
// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gangland',
});

const queryAsync = util.promisify(db.query).bind(db);

db.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }

  // Create 'users' table if it doesn't exist
  try {
    await queryAsync(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        bedrooms INT NOT NULL,
        bathrooms INT NOT NULL,
        squareFt INT NOT NULL,
        
      )
    `);
    console.log('Properties table created successfully');
  } catch (err) {
    console.error('Error creating properties table: ' + err);
  }

  console.log('Successfully connected to Database');
});


// Middleware to parse JSON
app.use(express.json());

// Routes
app.get('/api/properties', async (req, res) => {
  try {
    const results = await queryAsync('SELECT * FROM properties');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/properties', async (req, res) => {
  const { title, price, bedrooms, bathrooms, squareFt } = req.body;
  const property = { title, price, bedrooms, bathrooms, squareFt };

  try {
    const result = await queryAsync('INSERT INTO properties SET ?', property);
    res.json({ message: 'Property added successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  const propertyId = req.params.id;
  const { title, price, bedrooms, bathrooms, squareFt } = req.body;
  const property = { title, price, bedrooms, bathrooms, squareFt };

  try {
    await queryAsync('UPDATE properties SET ? WHERE id = ?', [property, propertyId]);
    res.json({ message: 'Property updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  const propertyId = req.params.id;

  try {
    await queryAsync('DELETE FROM properties WHERE id = ?', [propertyId]);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
