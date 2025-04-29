const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const albumRoutes = require('./routes/album');
const logger = require('./config/logger'); 

const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());        //configuration for CORS pending


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging: (msg) => logger.info(msg)
});



sequelize.authenticate()
  .then(() => {
    logger.info('Connected to the database');
  })
  .catch((err) => {
    logger.error('Error connecting to database:', err);
  });

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});