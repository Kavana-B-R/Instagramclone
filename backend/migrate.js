const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: "AIzaSyCf6_22eS1yxp6zoW2fXWP2GjEQkGiSSeg",
  authDomain: "insta-clone-projec.firebaseapp.com",
  projectId: "insta-clone-projec",
  storageBucket: "insta-clone-projec.firebasestorage.app",
  messagingSenderId: "751404823272",
  appId: "1:751404823272:web:a0f9191d197cdbba988f5d",
  measurementId: "G-8KLTR9M2ZL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const User = require('./models/User');
const Post = require('./models/Post');

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/instagram-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Migrate users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    for (const userData of users) {
      const user = new User({
        uid: userData.id, // Set uid to Firebase doc id
        username: userData.username,
        email: userData.email,
        password: userData.password || 'migrated', // Assuming password is hashed or set default
        fullName: userData.fullName || '',
        profilePicURL: userData.profilePicURL || '',
        bio: userData.bio || '',
        followers: userData.followers || [],
        following: userData.following || [],
      });
      await user.save();
      console.log(`Migrated user: ${user.username}`);
    }

    // Migrate posts
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    for (const postData of posts) {
      const post = new Post({
        createdBy: postData.createdBy,
        caption: postData.caption,
        imgURL: postData.imgURL,
        likes: postData.likes || [],
        comments: postData.comments || [],
      });
      await post.save();
      console.log(`Migrated post: ${post._id}`);
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
