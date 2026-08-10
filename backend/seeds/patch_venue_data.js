const mongoose = require('mongoose');
const Venue1 = require('../models/Venue1');

mongoose.connect('mongodb://127.0.0.1:27017/KheloIndore').then(async () => {
  const dataMap = new Map([
    ['Cricket', [
      { key: 'Pitch Type', value: 'Synthetic Turf' },
      { key: 'Pitch Size', value: '22 yards' },
      { key: 'Max Players', value: '22' }
    ]],
    ['Football', [
      { key: 'Ground Size', value: 'Full Size' },
      { key: 'Ground Type', value: 'Artificial Grass' },
      { key: 'Max Players', value: '22' }
    ]]
  ]);

  const res = await Venue1.updateOne(
    { _id: '6a6b1f6380018d9fbebb4fb4' },
    { $set: { data: dataMap } }
  );
  
  await mongoose.disconnect();
  process.exit(0);
}).catch(e => {  process.exit(1); });
