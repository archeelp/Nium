const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const pool = require('./daos/dbPool');
const resumeRoute = require('./routes/resumeRoute');
const requestIdMiddleware = require('./middlewares/requestIdMiddleware');
const path = require('path');
const rfs = require('rotating-file-stream');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Allow cross origin requests
app.use(cors());
// Middleware to generate a unique request ID
app.use(requestIdMiddleware);
// Setup morgan to log basic request details to console
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory, // directory where the logs are saved
    // Configure retention by defining a maximum file count
    maxFiles: 1, // keep logs for 30 days
});
morgan.token('id', (req) => req.requestId); // Add custom token for requestId
app.use(morgan(':id :remote-addr - [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {stream: accessLogStream}));

// Function to check database connectivity
const checkDatabaseConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()'); // A simple query to check the connection
        client.release();
        console.log('Database connection is healthy');
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        throw err;
    }
};

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Resume API',
            version: '1.0.0',
            description: 'A simple Express API to manage resumes',
        },
        servers: [{ url: 'http://localhost:8080' }],
    },
    apis: ['./index.js', './routes/*'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', resumeRoute);

const PORT = process.env.PORT;
checkDatabaseConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error('Failed to start the server due to database connection issues.', err);
        process.exit(1); // Exit the process with an error code
    });