import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  civilizations: [String],
  type: { type: String, required: true },
  cost: { type: Number, required: true },
  power: String,
  text: String,
  subtypes: [String],
  supertypes: [String],
  printings: [mongoose.Schema.Types.Mixed],
});

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/duel-masters';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const CardModel = mongoose.model('Card', CardSchema);

  const dataPath = path.resolve(__dirname, '../../../data/DuelMastersCards.json');
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const cards: any[] = raw.cards;

  let inserted = 0;
  let updated = 0;

  for (const card of cards) {
    const result = await CardModel.findOneAndUpdate(
      { name: card.name },
      {
        name: card.name,
        civilizations: card.civilizations ?? [],
        type: card.type,
        cost: card.cost,
        power: card.power,
        text: card.text,
        subtypes: card.subtypes ?? card.race ? (card.subtypes ?? [card.race]) : [],
        supertypes: card.supertypes ?? [],
        printings: card.printings ?? [],
      },
      { upsert: true, new: true },
    );
    if (result) updated++;
    else inserted++;
  }

  console.log(`Seed complete: ${cards.length} cards processed (upserted)`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
