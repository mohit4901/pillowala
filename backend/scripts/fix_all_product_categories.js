require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

async function fixCategories() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  const allCategories = await Category.find({});
  const catBySlug = {};
  allCategories.forEach(c => {
    catBySlug[c.slug] = c._id;
  });

  const bedsheetsRootId = catBySlug['bedsheets'];
  const fittedBedsheetsId = catBySlug['fitted-bedsheets'];
  const bedsheetSetsId = catBySlug['bedsheet-sets'];
  const cottonBedsheetsId = catBySlug['cotton-bedsheets'];
  const luxuryBedsheetsId = catBySlug['luxury-bedsheets'];

  const pillowsRootId = catBySlug['pillows'];
  const pillowCombosId = catBySlug['pillow-combos'];
  const sleepingPillowsId = catBySlug['sleeping-pillows'];
  const cervicalPillowsId = catBySlug['cervical-pillows'];

  const allProducts = await Product.find({});
  console.log(`Processing ${allProducts.length} products...`);

  let updatedCount = 0;

  for (const product of allProducts) {
    const nameLower = (product.name || '').toLowerCase();
    let targetCatId = null;

    // Check if it is a Bedsheet first!
    if (nameLower.includes('bedsheet')) {
      if (nameLower.includes('fitted') || nameLower.includes('elastic') || nameLower.includes('flannel') || nameLower.includes('velvet') || nameLower.includes('woolen')) {
        targetCatId = fittedBedsheetsId;
      } else if (nameLower.includes('set of 5') || nameLower.includes('5 pack') || nameLower.includes('cushion cover')) {
        targetCatId = bedsheetSetsId;
      } else if (nameLower.includes('cotton') || nameLower.includes('flat')) {
        targetCatId = cottonBedsheetsId;
      } else {
        targetCatId = bedsheetsRootId;
      }
    } else {
      // It is Pillows, Bolsters, Cushions
      if (nameLower.includes('combo') || nameLower.includes('pack of 2') || nameLower.includes('2 pcs') || nameLower.includes('set of 2') || nameLower.includes('stripes')) {
        targetCatId = pillowCombosId;
      } else if (nameLower.includes('cushion') || nameLower.includes('bolster')) {
        targetCatId = pillowsRootId;
      } else {
        targetCatId = sleepingPillowsId;
      }
    }

    product.categoryId = targetCatId;
    product.active = true;
    product.featured = true;
    await product.save();
    updatedCount++;
    console.log(`[UPDATED] [${product.marketplace.toUpperCase()}] ${product.name.slice(0, 40)} -> Cat: ${targetCatId}`);
  }

  console.log(`\nSuccessfully updated ${updatedCount} products!`);

  // Verify breakdown
  const bedsheetProducts = await Product.find({
    categoryId: { $in: [bedsheetsRootId, fittedBedsheetsId, bedsheetSetsId, cottonBedsheetsId, luxuryBedsheetsId] }
  });
  const pillowProducts = await Product.find({
    categoryId: { $in: [pillowsRootId, pillowCombosId, sleepingPillowsId, cervicalPillowsId] }
  });

  console.log(`\nVerified breakdown:`);
  console.log(`Bedsheets Count: ${bedsheetProducts.length}`);
  console.log(`Pillows Count: ${pillowProducts.length}`);

  process.exit(0);
}

fixCategories().catch(err => {
  console.error('Error fixing categories:', err);
  process.exit(1);
});
