const { MongoClient } = require('mongodb');

// This script seeds the MongoDB database with initial categories and an admin author.
// It ensures that the dashboard is ready for use immediately after migration.

const MONGODB_URI = 'mongodb+srv://Neeraj_news:neerajonu2026news@cluster0.mmyu0vw.mongodb.net/?appName=Cluster0onu';
const MONGODB_DB = 'drishyam_news';

const CATEGORIES = [
  { slug: 'india', en: 'India', hi: 'भारत', order: 1 },
  { slug: 'states', en: 'States', hi: 'राज्य', order: 2 },
  { slug: 'politics', en: 'Politics', hi: 'राजनीति', order: 3 },
  { slug: 'economy', en: 'Economy', hi: 'अर्थव्यवस्था', order: 4 },
  { slug: 'technology', en: 'Technology', hi: 'टेक्नोलॉजी', order: 5 },
  { slug: 'sports', en: 'Sports', hi: 'खेल', order: 6 },
  { slug: 'entertainment', en: 'Entertainment', hi: 'मनोरंजन', order: 7 },
  { slug: 'jobs', en: 'Jobs', hi: 'नौकरी', order: 8 },
  { slug: 'exams', en: 'Exams', hi: 'परीक्षा', order: 9 },
  { slug: 'explainers', en: 'Explainers', hi: 'एक्सप्लेनर्स', order: 10 },
  { slug: 'videos', en: 'Videos', hi: 'वीडियो', order: 11 },
  { slug: 'visual-stories', en: 'Visual Stories', hi: 'विजुअल स्टोरीज', order: 12 },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(MONGODB_DB);

    // 1. Seed Categories
    console.log('Seeding categories...');
    for (const cat of CATEGORIES) {
      const existing = await db.collection('categories').findOne({ slug: cat.slug });
      if (!existing) {
        await db.collection('categories').insertOne({
          name: cat.en, // Default name
          name_hi: cat.hi,
          name_en: cat.en,
          slug: cat.slug,
          order: cat.order,
          description: `${cat.en} news and analysis.`,
          description_hi: `${cat.hi} समाचार और विश्लेषण।`,
        });
        console.log(`Inserted category: ${cat.slug}`);
      } else {
        console.log(`Category already exists: ${cat.slug}`);
      }
    }

    // 2. Seed default Author
    console.log('Seeding default author...');
    const existingAuthor = await db.collection('authors').findOne({ name: 'Admin' });
    if (!existingAuthor) {
      await db.collection('authors').insertOne({
        name: 'Admin',
        bio: 'Drishyam News editorial team.',
        avatar: '/placeholder-user.jpg',
        email: 'admin@drishyam.com',
        role: 'Editor',
        socialLinks: {
          twitter: 'https://twitter.com/drishyam_news'
        }
      });
      console.log('Inserted default author: Admin');
    } else {
      console.log('Author already exists: Admin');
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
