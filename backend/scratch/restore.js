const fs = require('fs');
const path = require('path');
const { MongoClient, BSON } = require('mongodb');

const dbUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'KheloIndore';
const backupDir = 'C:\\Users\\Dell\\Downloads\\KheloIndore_backup\\KheloIndore';

function deserializeMultiple(buffer) {
  const docs = [];
  let offset = 0;
  while (offset < buffer.length) {
    if (buffer.length - offset < 4) {
      break;
    }
    const size = buffer.readInt32LE(offset);
    if (size <= 0 || offset + size > buffer.length) {
      break;
    }
    const docBuffer = buffer.subarray(offset, offset + size);
    try {
      const doc = BSON.deserialize(docBuffer);
      docs.push(doc);
    } catch (e) {
      console.error(`Error deserializing document at offset ${offset}:`, e.message);
      break;
    }
    offset += size;
  }
  return docs;
}

async function run() {
  const client = new MongoClient(dbUrl);
  try {
    await client.connect();
    console.log('Connected to local MongoDB successfully');
    const db = client.db(dbName);

    if (!fs.existsSync(backupDir)) {
      console.error(`Backup directory not found: ${backupDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(backupDir);
    const bsonFiles = files.filter(f => f.endsWith('.bson'));

    console.log(`Found ${bsonFiles.length} BSON files to restore.`);

    for (const file of bsonFiles) {
      const colName = path.basename(file, '.bson');
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);

      console.log(`Processing ${file} (${(stats.size / 1024).toFixed(2)} KB)...`);

      if (stats.size === 0) {
        console.log(`  - Collection '${colName}' is empty.`);
        continue;
      }

      const buffer = fs.readFileSync(filePath);
      const docs = deserializeMultiple(buffer);

      if (docs.length > 0) {
        // Clear existing data in collection
        await db.collection(colName).deleteMany({});
        
        // Insert new data
        const result = await db.collection(colName).insertMany(docs);
        console.log(`  - Successfully restored ${result.insertedCount} documents to collection '${colName}'`);
      } else {
        console.log(`  - No documents found in ${file}`);
      }
    }

    console.log('\nDatabase restore completed successfully!');
  } catch (err) {
    console.error('Error during restore process:', err);
  } finally {
    await client.close();
  }
}

run();
