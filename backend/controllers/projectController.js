import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.aggregate([
      { $match: { owner: req.user._id } },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'project',
          as: 'tasks'
        }
      },
      {
        $addFields: {
          totalTasks: { $size: '$tasks' },
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'Done'] }
              }
            }
          }
        }
      },
      {
        $project: {
          tasks: 0
        }
      }
    ]);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to access this project');
      }
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description, themeColor } = req.body;

    const project = new Project({
      name,
      description,
      themeColor: themeColor || '#6366f1',
      owner: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const { name, description, themeColor } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this project');
      }

      project.name = name || project.name;
      project.description = description || project.description;
      project.themeColor = themeColor || project.themeColor;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this project');
      }
      // Delete all tasks associated with this project
      await Task.deleteMany({ project: project._id });
      // Delete the project
      await Project.deleteOne({ _id: project._id });
      res.json({ message: 'Project and associated tasks removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getProjects, getProjectById, createProject, updateProject, deleteProject };
