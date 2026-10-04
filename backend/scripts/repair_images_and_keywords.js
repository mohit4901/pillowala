const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Product = require('../models/Product');
const { KNOWN_PRODUCTS } = require('../services/scraperService');

// Keyword & sleep profile generator for accurate sleep test matching
const generateSleepMetadata = (prod) => {
  const name = (prod.name || '').toLowerCase();
  const desc = (prod.description || '').toLowerCase();
  const fullText = `${name} ${desc}`;

  const isPillow = name.includes('pillow') || desc.includes('pillow') || name.includes('cushion') || name.includes('bolster');
  const isBedsheet = name.includes('bedsheet') || desc.includes('bedsheet') || name.includes('sheet');

  const keywords = new Set();
  const positions = new Set();
  let firmness = 'medium';
  let painRelief = 'general-comfort';
  let sleepClimate = 'all-season';
  let categoryType = isPillow ? 'pillow' : isBedsheet ? 'bedsheet' : 'accessory';

  // Keyword extraction based on materials & features
  if (fullText.includes('fiber') || fullText.includes('fibre')) keywords.add('fiber');
  if (fullText.includes('microfibre') || fullText.includes('microfiber')) {
    keywords.add('microfibre');
    keywords.add('microfiber');
    keywords.add('resilient-bounce');
  }
  if (fullText.includes('cotton')) {
    keywords.add('cotton');
    keywords.add('breathable');
    keywords.add('cooling');
    sleepClimate = 'hot';
  }
  if (fullText.includes('flannel') || fullText.includes('velvet') || fullText.includes('woolen') || fullText.includes('fleece')) {
    keywords.add('flannel');
    keywords.add('velvet');
    keywords.add('warmth');
    keywords.add('winter');
    keywords.add('cozy');
    sleepClimate = 'cold-winter';
  }
  if (fullText.includes('fitted') || fullText.includes('elastic')) {
    keywords.add('fitted');
    keywords.add('elastic');
    keywords.add('deep-pocket');
  }
  if (fullText.includes('frill')) keywords.add('frill-decorated');

  // Ergonomic attributes for pillows
  if (isPillow) {
    if (fullText.includes('cozy') || fullText.includes('ultra-soft') || fullText.includes('soft')) {
      firmness = 'soft';
      positions.add('stomach');
      positions.add('back');
      keywords.add('cloud-soft');
      keywords.add('low-loft');
    }
    if (fullText.includes('premium') || fullText.includes('ergonomic') || fullText.includes('alignment')) {
      firmness = 'firm';
      painRelief = 'neck-stiffness';
      positions.add('side');
      positions.add('back');
      keywords.add('cervical-support');
      keywords.add('orthopedic-feel');
      keywords.add('high-loft');
    }
    if (fullText.includes('stripes') || fullText.includes('bouncy') || fullText.includes('pack of 2') || fullText.includes('resilient')) {
      firmness = 'medium';
      positions.add('combination');
      positions.add('side');
      positions.add('back');
      keywords.add('adaptive-bounce');
      keywords.add('toss-turn');
    }
    if (positions.size === 0) {
      positions.add('side');
      positions.add('back');
      positions.add('combination');
    }
  }

  return {
    keywords: Array.from(keywords),
    sleepProfile: {
      suitablePositions: Array.from(positions),
      firmness,
      painRelief,
      sleepClimate,
      categoryType,
    },
  };
};

async function repair() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Syncing all 29 KNOWN_PRODUCTS into database with updated verified images & sleep metadata...');
    for (const kp of KNOWN_PRODUCTS) {
      const metadata = generateSleepMetadata(kp.data);
      const updateData = {
        name: kp.data.name,
        description: kp.data.description,
        price: kp.data.price,
        originalPrice: kp.data.originalPrice,
        images: kp.data.images,
        marketplace: kp.data.marketplace,
        rating: kp.data.rating,
        reviewCount: kp.data.reviewCount,
        keywords: metadata.keywords,
        sleepProfile: metadata.sleepProfile,
        active: true,
      };

      // Find by externalUrl or name
      const existing = await Product.findOne({
        $or: [
          { name: kp.data.name },
          { externalUrl: kp.matcher ? { $exists: true } : kp.data.externalUrl }
        ]
      });

      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: updateData });
        console.log(`Updated: ${kp.data.name.slice(0, 35)} (${kp.data.images.length} images)`);
      } else {
        await Product.create({
          ...updateData,
          externalUrl: kp.data.externalUrl || (kp.data.marketplace === 'flipkart' ? 'https://www.flipkart.com' : 'https://www.meesho.com'),
        });
        console.log(`Created: ${kp.data.name.slice(0, 35)}`);
      }
    }

    console.log('Repair & keyword enrichment completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error repairing products:', err);
    process.exit(1);
  }
}

repair();
