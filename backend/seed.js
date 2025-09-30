const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/instagram-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing users and posts
    await User.deleteMany({});
    await Post.deleteMany({});

    // Sample users
    const sampleUsers = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        fullName: 'John Doe',
        profilePicURL: '/profilepic.png',
        bio: 'Sample user 1',
        followers: [],
        following: [],
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        fullName: 'Jane Smith',
        profilePicURL: '/profilepic.png',
        bio: 'Sample user 2',
        followers: [],
        following: [],
      },
      {
        username: 'bob_johnson',
        email: 'bob@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        fullName: 'Bob Johnson',
        profilePicURL: '/profilepic.png',
        bio: 'Sample user 3',
        followers: [],
        following: [],
      },
    ];

    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Seeded user: ${user.username}`);
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedUsers();
