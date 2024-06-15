const express = require('express');
const Model = require('../model/model');

const router = express.Router()

//Post Method
router.post('/task', async (req, res) => {
    const task = new Model({
        task: req.body.task,
        num: req.body.num
    })
    try {
        const dataToSave = await task.save();
        res.status(200).json(dataToSave)

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/task', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/task/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/task/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/task/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Task ${data.num}: "${data.task}" .has been deleted..`)
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;