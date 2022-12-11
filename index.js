import express from 'express';
import {
    createEmployee,
    createTask,
    deleteEmployee,
    deleteTask,
    editEmployee,
    editTask,
    getEmployees,
    getTask,
    getTasks
} from './data.js';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors())
app.use(express.json());

app.get('/', async (req, res) => {
    res.send(await getTasks());
});

app.post('/task/create', async (req, res) => {
    res.send(await createTask(req.body));
});

app.post('/employee/create', async (req, res) => {
    res.send(await createEmployee(req.body));
});

app.get('/task/:id', async (req, res) => {
    res.send(await getTask(req.params.id));
});

app.get('/employees', async (req, res) => {
    res.send(await getEmployees());
});

app.post('/employee', async (req, res) => {
    res.send(await editEmployee(req.body));
});

app.post('/task', async (req, res) => {
    res.send(await editTask(req.body));
});

app.post('/task/delete', async (req, res) => {
    res.send(await deleteTask(req.body));
});

app.post('/employee/delete', async (req, res) => {
    res.send(await deleteEmployee(req.body));
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
});