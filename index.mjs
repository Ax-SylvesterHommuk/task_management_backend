import express from 'express';
import app from './app.js';
import swaggerUi from 'swagger-ui-express';
import yamlJs from 'yamljs';
import { sessionHandler } from './middleware/session.js';
import authRouter from './routes/auth.js';

const port = process.env.PORT || 3000;

// Serve static files from svelte app
app.use(express.static('public'));

// Use the Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(yamlJs.load('./swagger.yaml')));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(sessionHandler);
app.use(authRouter);

app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}/api/docs`);
    console.log(`Website: http://localhost:${port}/`)
});