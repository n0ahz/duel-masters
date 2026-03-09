import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/duel-masters';

const CardSchema = new mongoose.Schema(
  {
    name: String,
    civilizations: [String],
    cost: Number,
    power: String,
    type: String,
    subtypes: [String],
    supertypes: [String],
    text: String,
    printings: [
      {
        set: String,
        id: String,
        rarity: String,
        illustrator: String,
        flavor: String,
      },
    ],
  },
  { strict: false },
);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const CardModel = mongoose.model('Card', CardSchema, 'cards');

  const dataPath = path.join(__dirname, '../../../data/DuelMastersCards.json');
  console.log(`Reading cards from ${dataPath}...`);
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const { cards } = JSON.parse(raw);

  console.log(`Found ${cards.length} cards. Upserting...`);

  const ops = cards.map((card: any) => ({
    updateOne: {
      filter: {
        name: card.name,
        'printings.0.set': card.printings?.[0]?.set,
        'printings.0.id': card.printings?.[0]?.id,
      },
      update: { $setOnInsert: card },
      upsert: true,
    },
  }));

  const result = await CardModel.bulkWrite(ops);
  console.log(
    `Seed complete: ${result.upsertedCount} inserted, ${result.matchedCount} already existed`,
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
