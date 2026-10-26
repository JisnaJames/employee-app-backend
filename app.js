// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.static(path.join(__dirname+'/dist/Frontend'))); // same folder, matches its real name on case-sensitive systems
// Task2: create mongoDB connection 
// Replace the placeholder below with your own MongoDB Atlas connection string
// (or set the MONGODB_URI environment variable).
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://jisna225768_db_user:jisna@cluster0.xefpkrj.mongodb.net/';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const Employee = mongoose.model('Employee', employeeSchema, 'employeelist');

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below



//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
    }
});



//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch employee', error: err.message });
    }
});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const employee = await new Employee({ name, location, position, salary }).save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add employee', error: err.message });
    }
});



//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted', employee: deleted });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete employee', error: err.message });
    }
});



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body;
        const updated = await Employee.findByIdAndUpdate(
            _id,
            { name, location, position, salary },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update employee', error: err.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});
