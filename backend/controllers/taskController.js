import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access these tasks');
    }

    const tasks = await Task.find({ project: projectId }).populate('assignee', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, assignee, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to add task to this project');
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      project: projectId,
      dueDate,
      assignee: assignee || req.user._id
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
      // For a real app, you'd want to check if the user has access to this task's project
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      if (assignee) task.assignee = assignee;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await Task.deleteOne({ _id: task._id });
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getTasks, createTask, updateTask, deleteTask };
