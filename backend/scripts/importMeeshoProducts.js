require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { scrapeProduct } = require('../services/scraperService');

const MEESHO_URLS = [
  'https://www.meesho.com/bed-pillowcozy-pillow-16x24-2-pcs/p/bsh3um',
  'https://www.meesho.com/premium-bed-pillow-16x26-inch/p/6qtopy?ms=2&source=Meri+Shop',
  'https://www.meesho.com/fibre-pillow-bed-pillow-16x26-inch/p/83hcc9?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hnv6kg?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/ho1lmw?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/ho5a6w?ms=2&source=Meri+Shop',
  'https://www.meesho.com/cushion-16x16/p/ag8mr5?ms=2&source=Meri+Shop',
  'https://www.meesho.com/cotton-flat-bedsheet-90-x-95-inch-i-set-of-5-i-frill-decorated-pillow-and-cushion-cover-i-olive-green/p/c9chsy?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hny264?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-fitted-bedsheet-ii-350-tc-with-2-matching-pillow-cover/p/hxyham?ms=2&source=Meri+Shop',
  'https://www.meesho.com/cotton-220tc-fitted-bedsheet-size-78x-72x6/p/c413d9?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hqqdom?ms=2&source=Meri+Shop',
  'https://www.meesho.com/cotton-flat-bedsheet-with-frill-decorated-pillow/p/gy9ngp?ms=2&source=Meri+Shop',
  'https://www.meesho.com/cotton-feel-bedsheet-90-90-frill-decorated-2-pillow-2-cushion-size-12x12-with-cushion-filler-5-pack-set/p/fvy5y8?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hnyybz?ms=2&source=Meri+Shop',
  'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hqppoh?ms=2&source=Meri+Shop',
  'https://www.meesho.com/cotton-flat-bedsheet-size-90-100-with2-pillow-cover/p/c6i4yx?ms=2&source=Meri+Shop',
];

async function runBatchScrape() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

    const categories = await Category.find({});
    console.log(`Loaded ${categories.length} categories from database.`);

    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    console.log(`\nBeginning scrape of ${MEESHO_URLS.length} Meesho products...\n`);

    let imported = 0;

    for (let i = 0; i < MEESHO_URLS.length; i++) {
      const url = MEESHO_URLS[i];
      console.log(`[${i + 1}/${MEESHO_URLS.length}] Scraping: ${url}`);

      try {
        const scraped = await scrapeProduct(url);

        // Determine category matching
        let categoryId = null;
        const nameLower = (scraped.name || '').toLowerCase();

        if (nameLower.includes('fitted') && (nameLower.includes('flannel') || nameLower.includes('velvet'))) {
          categoryId = catMap['fitted-bedsheets'] || catMap['luxury-bedsheets'] || catMap['bedsheets'];
        } else if (nameLower.includes('fitted')) {
          categoryId = catMap['fitted-bedsheets'] || catMap['bedsheets'];
        } else if (nameLower.includes('set of 5') || nameLower.includes('5 pack set') || nameLower.includes('with frill')) {
          categoryId = catMap['bedsheet-sets'] || catMap['bedsheets'];
        } else if (nameLower.includes('bedsheet') || nameLower.includes('cotton flat')) {
          categoryId = catMap['cotton-bedsheets'] || catMap['bedsheets'];
        } else if (nameLower.includes('cushion') || nameLower.includes('2 pcs') || nameLower.includes('pack of 2')) {
          categoryId = catMap['pillow-combos'] || catMap['pillows'];
        } else if (nameLower.includes('fibre') || nameLower.includes('fiber')) {
          categoryId = catMap['cotton-pillows'] || catMap['pillows'];
        } else if (nameLower.includes('pillow')) {
          categoryId = catMap['sleeping-pillows'] || catMap['pillows'];
        } else {
          categoryId = catMap['bedsheets'];
        }

        // Clean external URL for storage (strip query params like ?ms=2)
        const cleanBaseUrl = url.split('?')[0];

        // Check if exists
        const existing = await Product.findOne({
          $or: [
            { externalUrl: url },
            { externalUrl: cleanBaseUrl },
            { name: scraped.name },
          ],
        });

        if (existing) {
          existing.name = scraped.name;
          existing.description = scraped.description || existing.description;
          existing.price = scraped.price || existing.price;
          existing.originalPrice = scraped.originalPrice || existing.originalPrice;
          existing.images = scraped.images?.length ? scraped.images : existing.images;
          existing.marketplace = 'meesho';
          existing.externalUrl = url;
          existing.categoryId = categoryId || existing.categoryId;
          existing.rating = scraped.rating || existing.rating;
          existing.reviewCount = scraped.reviewCount || existing.reviewCount;
          existing.active = true;
          await existing.save();
          console.log(`   Updated existing product: "${existing.name}" (₹${existing.price})`);
        } else {
          const created = await Product.create({
            name: scraped.name,
            description: scraped.description || `${scraped.name} - 100% Genuine Pillowala quality sold on Meesho.`,
            price: scraped.price || 499,
            originalPrice: scraped.originalPrice || (scraped.price ? Math.round(scraped.price * 1.5) : 799),
            images: scraped.images?.length ? scraped.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
            marketplace: 'meesho',
            externalUrl: url,
            categoryId: categoryId || catMap['pillows'],
            active: true,
            featured: i < 6, // feature first few
            rating: scraped.rating || 4.4,
            reviewCount: scraped.reviewCount || 95,
          });
          console.log(`   Created new product: "${created.name}" (₹${created.price})`);
        }

        imported++;
      } catch (err) {
        console.error(`   Error scraping ${url}:`, err.message);
      }

      // Small delay between requests to be polite
      await new Promise((r) => setTimeout(r, 600));
    }

    console.log(`\n Batch scraping complete! Successfully processed ${imported} products.\n`);
    process.exit(0);
  } catch (err) {
    console.error('Fatal batch import error:', err);
    process.exit(1);
  }
}

runBatchScrape();
