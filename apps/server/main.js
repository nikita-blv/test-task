import express from 'express';
import cors from 'cors';
import { createServer } from "node:http";

import { env } from '#root/shared/env.js';
import { appRouter } from '#root/routes/index.js';
import { connectMongo } from '#root/shared/mongoose.js';
import { createSocket } from "#root/shared/socket.js";
import path from "node:path";
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);
const io = createSocket(server)

app.use(cors())

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('I am fine ✌️');
});

app.use('/api', appRouter);


const CLIENT_ROUTE = '/client'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(CLIENT_ROUTE, express.static('public/dist', {etag: false}))
app.get(`${CLIENT_ROUTE}/*`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

app.get('/', (req, res) => {
    res.redirect(CLIENT_ROUTE)
})

const port = env.port;

server.listen(port, async () => {
    console.log(`App run on port ${port}`);
    await connectMongo();
    console.log(`Connected to mongodb`);
});
