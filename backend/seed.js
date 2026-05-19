import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import Task from './models/Task.js';
import User from './models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find or create the test user
    let user = await User.findOne({ email: 'user1@example.com' });
    
    if (!user) {
      console.log('Creating test user...');
      user = await User.create({
        name: 'Test User',
        email: 'user1@example.com',
        password: 'password123'
      });
      console.log('Test user created successfully');
    }

    // Clear existing sample data (optional, but let's just add to what's there to be safe)
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Create Projects
    const projects = [
      {
        name: 'Website Redesign',
        description: 'Overhauling the corporate website with a modern glassmorphism UI.',
        themeColor: '#ec4899', // Pink
        owner: user._id
      },
      {
        name: 'Q3 Marketing Campaign',
        description: 'Planning and executing the new digital marketing strategy.',
        themeColor: '#f59e0b', // Orange/Amber
        owner: user._id
      },
      {
        name: 'Mobile App Development',
        description: 'Building the cross-platform React Native application.',
        themeColor: '#14b8a6', // Teal
        owner: user._id
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log(`Created ${createdProjects.length} projects`);

    // Create Tasks
    const tasks = [
      // Website Redesign Tasks
      {
        title: 'Design Figma Mockups',
        description: 'Create high-fidelity mockups for the homepage and about page.',
        status: 'Done',
        priority: 'High',
        project: createdProjects[0]._id,
        assignee: user._id,
        dueDate: yesterday
      },
      {
        title: 'Implement Navigation Bar',
        description: 'Build responsive navbar with dropdowns and mobile menu.',
        status: 'Review',
        priority: 'Medium',
        project: createdProjects[0]._id,
        assignee: user._id,
        dueDate: today
      },
      {
        title: 'Optimize Core Web Vitals',
        description: 'Improve LCP and CLS scores across all main landing pages.',
        status: 'To Do',
        priority: 'High',
        project: createdProjects[0]._id,
        assignee: user._id,
        dueDate: tomorrow
      },
      
      // Q3 Marketing Tasks
      {
        title: 'Draft Social Media Posts',
        description: 'Write copy for Twitter, LinkedIn, and Instagram campaigns.',
        status: 'In Progress',
        priority: 'Medium',
        project: createdProjects[1]._id,
        assignee: user._id,
        dueDate: tomorrow
      },
      {
        title: 'Finalize Ad Budget',
        description: 'Approve final Q3 spending allocations with finance team.',
        status: 'To Do',
        priority: 'Low',
        project: createdProjects[1]._id,
        assignee: user._id,
        dueDate: nextWeek
      },
      
      // Mobile App Tasks
      {
        title: 'Setup React Native CLI',
        description: 'Initialize project and install core dependencies.',
        status: 'Done',
        priority: 'High',
        project: createdProjects[2]._id,
        assignee: user._id,
        dueDate: yesterday
      },
      {
        title: 'Build Login Screen',
        description: 'Implement JWT authentication and form validation.',
        status: 'In Progress',
        priority: 'High',
        project: createdProjects[2]._id,
        assignee: user._id,
        dueDate: today
      }
    ];

    await Task.insertMany(tasks);
    console.log(`Created ${tasks.length} tasks`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
