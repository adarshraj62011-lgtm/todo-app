const Task = require('../models/Task');

/**
 * @desc    Fetch all tasks belonging to the authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    
    // Build dynamic query object based on provided filters
    let query = { user: req.user.id };
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      // Case-insensitive search on title
      query.title = { $regex: search, $options: 'i' };
    }

    // Sort by custom order first, then by creation date
    const tasks = await Task.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new task for the authenticated user
 * @route   POST /api/tasks
 * @access  Private
 */
const setTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Please add a title' });
    }

    // Calculate initial display order (place at the end of the existing list)
    const lastTask = await Task.findOne({ user: req.user.id }).sort('-order');
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      category,
      dueDate,
      order,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ownership check: Ensure user owns the task they are trying to update
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a specific task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ownership check: Ensure user owns the task they are trying to delete
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Bulk update task positions (Drag & Drop support)
 * @route   PUT /api/tasks/reorder
 * @access  Private
 */
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Expects array of { id, order, status }

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Valid tasks array is required' });
    }

    // Use MongoDB bulkWrite for efficient multi-document updates
    const bulkOps = tasks.map((task) => ({
      updateOne: {
        filter: { _id: task.id, user: req.user.id },
        update: { $set: { order: task.order, status: task.status } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
