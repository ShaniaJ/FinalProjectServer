import express from 'express';
import {editTask, getEmployees, getTask, getTasks} from './data.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors())
app.use(express.json());

app.get('/', async (req, res) => {
    res.send(await getTasks());
});

app.get('/task/:id', async (req, res) => {
    res.send(await getTask(req.params.id));
});

app.get('/employees', async (req, res) => {
    res.send(await getEmployees());
});

app.post('/task', async (req, res) => {
    res.send(await editTask(req.body));
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
});