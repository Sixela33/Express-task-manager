const Task = require('../models/Task')
const {createCustomError} = require('../errors/custom-error')
const asyncWrapper = require('../middleware/async')

const getAllTasks = asyncWrapper( async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json({ tasks }) 
})

const createTask = asyncWrapper (async (req, res) => {
    const task = await Task.create(req.body)
    res.status(201).json({ task })
})

const getTask = asyncWrapper (async (req, res, next) => {
    const {id:taskID} = req.params
    const task = await Task.findOne({_id: req.params.id})
    if(!task) {
        return next(createCustomError(`No task with ID : ${taskID}`, 404))

    }
    return res.status(200).json(task)
})

const updateTask = asyncWrapper (async (req, res) => {

    const {id:taskID} = req.params
    const task = await Task.findOneAndUpdate({_id:taskID}, req.body, {
        new:true,
        runValidators: true
    })
    if(!task) {
        return res.status(404).json({msg: `No task with ID : ${taskID}`})
    }
    res.status(200).json({ task })
})

const deleteTask = asyncWrapper (async (req, res) => {

    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task) {
        return next(createCustomError(`No task with ID : ${taskID}`, 404))
    }

    res.status(200).json({msg: `Task deleted`})
})

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
}