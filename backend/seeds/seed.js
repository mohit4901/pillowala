require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, closeDB } = require('../config/db');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Review = require('../models/Review');
const LuckyDraw = require('../models/LuckyDraw');
const { KNOWN_PRODUCTS } = require('../services/scraperService');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to database for seeding...');
      await connectDB();
    }

    console.log('Clearing catalog collections for fresh seed...');
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Offer.deleteMany({});
    // Note: Never wipe user submitted reviews or lucky draw records

    // 1. Seed Admin
    console.log('Seeding Admin account...');
    const admin = await Admin.create({
      name: 'Pillowala Admin',
      email: 'admin@pillowala.com',
      password: 'Admin@12345',
      role: 'superadmin',
    });
    console.log(`Created admin: ${admin.email} (Password: Admin@12345)`);

    // 2. Seed Categories
    console.log('Seeding Categories...');
    const categoriesData = [
      {
        name: 'Pillows Collection',
        slug: 'pillows',
        description: 'Doctor-designed orthopedic, memory foam, and luxury microfibre pillows.',
        image: 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        parentCategory: 'root',
        isMain: true,
        active: true,
      },
      {
        name: 'Bedsheets Collection',
        slug: 'bedsheets',
        description: 'Pure cotton, printed, and winter velvet fitted bedsheets with coordinated pillow covers.',
        image: 'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg?q=70',
        parentCategory: 'root',
        isMain: true,
        active: true,
      },
      {
        name: 'Fitted Elastic Bedsheets',
        slug: 'fitted-bedsheets',
        description: 'Winter velvet and cotton fitted sheets that stay tight and wrinkle-free.',
        image: 'https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512',
        parentCategory: 'bedsheets',
        isMain: false,
        active: true,
      },
      {
        name: 'Microfibre Pillows',
        slug: 'microfibre-pillows',
        description: 'High-density bouncy sleeping pillows for neck & head alignment.',
        image: 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        parentCategory: 'pillows',
        isMain: false,
        active: true,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed ALL 29 REAL PRODUCTS FROM KNOWN_PRODUCTS (Meesho & Flipkart Only)
    console.log('Seeding 29 Real Products from Meesho & Flipkart...');

    const productsData = KNOWN_PRODUCTS.map((kp) => {
      const isPillow =
        kp.data.name.toLowerCase().includes('pillow') ||
        kp.data.name.toLowerCase().includes('cushion') ||
        kp.data.name.toLowerCase().includes('bolster');

      let categoryId = isPillow ? catMap['microfibre-pillows'] : catMap['fitted-bedsheets'];

      // Assign real external marketplace URL
      let externalUrl = '';
      if (kp.data.marketplace === 'meesho') {
        const codeMatch = kp.code || (kp.data.name.includes('16x26') ? '7atwd7' : '');
        if (codeMatch) {
          externalUrl = `https://www.meesho.com/s/p/${codeMatch}`;
        } else {
          externalUrl = 'https://www.meesho.com';
        }
      } else if (kp.data.marketplace === 'flipkart') {
        const pidMatch = kp.code || '';
        if (pidMatch && pidMatch.startsWith('BDS')) {
          externalUrl = `https://www.flipkart.com/product/p/itme?pid=${pidMatch}`;
        } else if (pidMatch) {
          externalUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(kp.data.name)}`;
        } else {
          externalUrl = 'https://www.flipkart.com/search?q=pillowala';
        }
      }

      return {
        name: kp.data.name,
        description: kp.data.description,
        images: kp.data.images,
        price: kp.data.price,
        originalPrice: kp.data.originalPrice,
        categoryId,
        marketplace: kp.data.marketplace,
        externalUrl,
        active: true,
        featured: true,
        rating: kp.data.rating || 4.5,
        reviewCount: kp.data.reviewCount || 100,
      };
    });

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${createdProducts.length} real products (Meesho & Flipkart).`);

    // 4. Seed Offers
    console.log('Seeding Offers...');
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);

    const offersData = [
      {
        title: 'Flipkart Official Store Launch Offer',
        description: 'Shop genuine Pillowala 200 TC cotton & velvet bedsheets on Flipkart with guaranteed marketplace delivery.',
        discountText: 'Special Deal ₹424',
        couponCode: 'FLIPKART424',
        template: 'template-luxe-gold',
        startDate: now,
        endDate: futureDate,
        image: 'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg?q=70',
        productIds: [createdProducts[18]._id],
        active: true,
      },
      {
        title: 'Meesho Meri Shop Combo Bonanza',
        description: 'Buy Pack of 2 16x26 Microfibre pillows and get direct manufacturer savings.',
        discountText: 'Pack of 2 for ₹387',
        couponCode: 'MEESHO387',
        template: 'template-royal-indigo',
        startDate: now,
        endDate: futureDate,
        image: 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        productIds: [createdProducts[0]._id],
        active: true,
      },
    ];

    await Offer.insertMany(offersData);
    console.log('Seeded active offers.');

    // 5. Seed Real Reviews (ONLY Meesho & Flipkart)
    console.log('Reviews collection kept 100% clean for real customer submissions.');
    console.log('✅ Seeding completed with 29 real products and clean Lucky Draw!');
    return true;
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedData };
