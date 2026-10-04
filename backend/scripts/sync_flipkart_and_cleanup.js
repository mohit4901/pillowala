require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const FLIPKART_PRODUCTS = [
  {
    code: 'BDSHQWH6TZYHVMHS',
    url: 'https://www.flipkart.com/pillowala-fleece-velvet-king-fitted-elastic-350-tc-floral-1-bedsheet-2-pillow-covers/p/itm14b625d21ae4f?pid=BDSHQWH6TZYHVMHS',
    name: 'PILLOWALA Fleece, Velvet King Fitted (Elastic) 350 TC Floral 1 Bedsheet with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 628,
    originalPrice: 899,
    rating: 4.4,
    reviewCount: 412,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/o/y/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhknxxyz9yq.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/k/j/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkqhzfqgu7.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/j/u/i/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhk49qjcggc.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/w/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkxph37qd3.jpeg'
    ]
  },
  {
    code: 'BDSHQXQ7QWB9PTMU',
    url: 'https://www.flipkart.com/pillowala-velvet-single-fitted-elastic-350-tc-floral-1-winter-bedsheet-2-pillow-covers/p/itmdcf4784d7298b?pid=BDSHQXQ7QWB9PTMU',
    name: 'PILLOWALA Velvet Single Fitted (Elastic) 350 TC Floral 1 Winter Bedsheet with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 617,
    originalPrice: 999,
    rating: 4.3,
    reviewCount: 380,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/4/8/f/flannel-1-flannel-2001-flat-pillowala-original-imahqwdc8es6mg8j.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/d/g/c/flannel-1-flannel-2001-flat-pillowala-original-imahqwdczpgtjvqc.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/o/d/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahbbhdv8s8.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/a/q/t/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqxq778yyqu6w.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/p/j/e/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkmrpnyjhm.jpeg'
    ]
  },
  {
    code: 'BDSHP73YZZFYJHHR',
    url: 'https://www.flipkart.com/pillowala-cotton-double-king-queen-flat-200-tc-printed-1-summer-bedsheet-2-pillow-covers/p/itm4a57b1b823bff?pid=BDSHP73YZZFYJHHR',
    name: 'PILLOWALA Cotton Double, King, Queen Flat 200 TC Printed 1 Summer Bedsheet with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 501,
    originalPrice: 799,
    rating: 4.5,
    reviewCount: 890,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/d/n/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73yt3z89u9g.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/7/b/c/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73y8r5893a7.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/z/g/v/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73ycfd8g2he.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/f/b/u/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73y827xrysz.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/v/y/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73ygfyg8ghz.jpeg'
    ]
  },
  {
    code: 'CPCHPBT5TNNSHVYF',
    url: 'https://www.flipkart.com/pillowala-cotton-bolsters-cover/p/itmdc619eda96b4a?pid=CPCHPBT5TNNSHVYF',
    name: 'PILLOWALA Cotton Bolsters Cover (Set of Bolster Covers)',
    categorySlug: 'pillows',
    price: 348,
    originalPrice: 522,
    rating: 4.3,
    reviewCount: 260,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/u/e/e/mavi-5pc-bolster-set-green-1-mavi-5pc-bolster-set-green-flat-original-imahpbhjynx2aqyg.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/f/q/g/41-0-elephant-printed-bolsters-cover-kaytra-82-0-original-imahgsdrdbavhaud.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/7/h/f/mavi-5pc-bolster-set-green-1-mavi-5pc-bolster-set-green-flat-original-imahpbhjwxug2vvh.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/r/r/2/25-mavi-green-bolster-pillowala-82-original-imahpbt524222vhq.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/5/t/x/25-mavi-green-bolster-pillowala-82-original-imahpbt5svzxvvhf.jpeg'
    ]
  },
  {
    code: 'BDSHQVHKNJJZQVZU',
    url: 'https://www.flipkart.com/pillowala-woolen-double-queen-king-super-king-fitted-elastic-350-tc-printed-1-winter-bedsheet-2-pillow-covers/p/itmed74bc30f093c?pid=BDSHQVHKNJJZQVZU',
    name: 'PILLOWALA Woolen Double, Queen, King, Super King Fitted (Elastic) 350 TC Printed 1 Winter Bedsheet with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 617,
    originalPrice: 926,
    rating: 4.4,
    reviewCount: 310,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/k/j/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkqhzfqgu7.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/o/y/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhknxxyz9yq.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/j/u/i/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhk49qjcggc.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/w/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkxph37qd3.jpeg'
    ]
  },
  {
    code: 'BDSHQXQ7HRGJ7RVR',
    url: 'https://www.flipkart.com/pillowala-velvet-double-fitted-elastic-350-tc-floral-1-bedsheet-2-pillow-covers/p/itmaf855c9e6f92e?pid=BDSHQXQ7HRGJ7RVR&marketplace=FLIPKART&lid=LSTBDSHQXQ7HRGJ7RVRYZYOQT&pageUID=1789841826971',
    name: 'PILLOWALA Velvet Double Fitted (Elastic) 350 TC Floral 1 Bedsheet with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 609,
    originalPrice: 914,
    rating: 4.3,
    reviewCount: 290,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/4/8/f/flannel-1-flannel-2001-flat-pillowala-original-imahqwdc8es6mg8j.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/d/g/c/flannel-1-flannel-2001-flat-pillowala-original-imahqwdczpgtjvqc.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/o/d/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahbbhdv8s8.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/a/q/t/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqxq778yyqu6w.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/p/j/e/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkmrpnyjhm.jpeg'
    ]
  },
  {
    code: 'BDSHQWCE6SMPZDGV',
    url: 'https://dl.flipkart.com/s/v9KtEyNNNN',
    name: 'PILLOWALA Woolen Double, Queen, King, Super King Fitted (Elastic) 350 TC Floral 1 Bedsheet with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 630,
    originalPrice: 945,
    rating: 4.4,
    reviewCount: 360,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/u/n/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahjahhqjgk.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/o/d/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahbbhdv8s8.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/y/d/1/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahejwscgdr.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/p/j/e/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkmrpnyjhm.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/h/n/falnnel-bedsheet-1-3001-w-green-fitted-elastic-pillowala-original-imahqqu44ya4vusd.jpeg'
    ]
  },
  {
    code: 'CPCHQH82',
    url: 'https://dl.flipkart.com/s/8x2!1iuuuN',
    name: 'PILLOWALA Cotton Bolsters Cover (25 Inch)',
    categorySlug: 'pillows',
    price: 222,
    originalPrice: 333,
    rating: 4.2,
    reviewCount: 180,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/c/i/y/25-jazz-bolster-pillowala-82-original-imahqhhmbsdnyu88.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/n/f/p/25-bolster-y-jazz-pillowala-82-original-imahqfv9sxybrvxp.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/h/k/w/25-jazz-bolster-pillowala-82-original-imahqhhm2jy4z6hq.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/f/h/r/25-jazz-bolster-pillowala-82-original-imahqhhmsbhdvh9d.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/t/n/u/25-bolster-y-jazz-pillowala-82-original-imahqfv99zb8cbvh.jpeg'
    ]
  },
  {
    code: 'PLW2STRIPE',
    url: 'https://dl.flipkart.com/s/8Ee7vkuuuN',
    name: 'PILLOWALA Polyester Fibre, Microfibre Sleeping Pillow Pack of 2 Stripes',
    categorySlug: 'pillows',
    price: 300,
    originalPrice: 450,
    rating: 4.5,
    reviewCount: 1240,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/j/b/e/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcduxcecpv.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/f/i/w/20-green-pillow-2-green-pillowala-original-imahmawsghuzhxct.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/o/l/u/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcrdqvcg3f.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/g/i/i/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcakf4vadf.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/p/d/p/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcepxyhtwe.jpeg'
    ]
  },
  {
    code: 'BDSHPAU55PC',
    url: 'https://dl.flipkart.com/s/v95syrNNNN',
    name: 'PILLOWALA Cotton King, Queen, Double Flat 200 TC Printed Summer Bedsheet with 2 Pillow Covers & 2 Cushion Covers',
    categorySlug: 'bedsheets',
    price: 458,
    originalPrice: 687,
    rating: 4.4,
    reviewCount: 780,
    images: [
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/s/8/h/am-ft-955-1-am-ft-955-fitted-elastic-amrange-original-imahzm3tyzvjszxv.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/t/m/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5es6xuxxh.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/c/5/e/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5eqpfz4dj.jpeg',
      'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/z/e/f/frill-5-set-mavi-1-mavi-5-pcs-set-flat-pillowala-original-imahp8kh52g8zgse.jpeg'
    ]
  }
];

async function syncAndClean() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  // 1. Remove all Amazon products
  const delAmazon = await Product.deleteMany({ marketplace: 'amazon' });
  console.log(`Deleted all Amazon products: ${delAmazon.deletedCount}`);

  // 2. Remove old dummy Flipkart seeded products (the ones with unsplash images)
  const delFlipkartDummy = await Product.deleteMany({
    marketplace: 'flipkart',
    images: { $elemMatch: { $regex: /unsplash/i } }
  });
  console.log(`Deleted dummy Flipkart products: ${delFlipkartDummy.deletedCount}`);

  // Also remove any remaining Meesho products with unsplash if any exist
  const delMeeshoDummy = await Product.deleteMany({
    marketplace: 'meesho',
    images: { $elemMatch: { $regex: /unsplash/i } }
  });
  console.log(`Deleted any leftover dummy Meesho products: ${delMeeshoDummy.deletedCount}`);

  // 3. Upsert the 10 authentic Flipkart products
  const pillowsCat = await Category.findOne({ slug: 'pillows' });
  const bedsheetsCat = await Category.findOne({ slug: 'bedsheets' });
  const catMap = {
    pillows: pillowsCat?._id,
    bedsheets: bedsheetsCat?._id,
  };

  for (const item of FLIPKART_PRODUCTS) {
    const categoryId = catMap[item.categorySlug] || bedsheetsCat?._id;
    const existing = await Product.findOne({
      $or: [
        { externalUrl: item.url },
        { externalUrl: new RegExp(item.code, 'i') },
        { name: item.name }
      ]
    });

    if (existing) {
      existing.name = item.name;
      existing.price = item.price;
      existing.originalPrice = item.originalPrice;
      existing.images = item.images;
      existing.category = categoryId;
      existing.marketplace = 'flipkart';
      existing.externalUrl = item.url;
      existing.rating = item.rating;
      existing.reviewCount = item.reviewCount;
      existing.isFeatured = true;
      existing.isActive = true;
      await existing.save();
      console.log(`[UPDATED FLIPKART] ${item.code} - ${item.name.slice(0, 40)} (${item.images.length} imgs)`);
    } else {
      await Product.create({
        name: item.name,
        description: `${item.name}. Genuine Flipkart Pillowala product with 100% verified quality fabric.`,
        price: item.price,
        originalPrice: item.originalPrice,
        category: categoryId,
        images: item.images,
        marketplace: 'flipkart',
        externalUrl: item.url,
        rating: item.rating,
        reviewCount: item.reviewCount,
        stock: 50,
        isFeatured: true,
        isActive: true,
      });
      console.log(`[CREATED FLIPKART] ${item.code} - ${item.name.slice(0, 40)} (${item.images.length} imgs)`);
    }
  }

  // 4. Verification of final database status
  const allProducts = await Product.find({}).sort({ marketplace: 1 });
  console.log(`\n=== FINAL DATABASE AUDIT: ${allProducts.length} PRODUCTS TOTAL ===`);
  
  const byMarketplace = {};
  let unsplashCount = 0;
  for (const p of allProducts) {
    byMarketplace[p.marketplace] = (byMarketplace[p.marketplace] || 0) + 1;
    if (p.images[0]?.includes('unsplash')) {
      unsplashCount++;
    }
  }
  console.log('Marketplaces Breakdown:', byMarketplace);
  console.log('Unsplash/Dummy Placeholder count:', unsplashCount);

  allProducts.forEach((p, idx) => {
    console.log(`[${idx+1}] [${p.marketplace.toUpperCase()}] ₹${p.price} | ${p.name.slice(0, 38)} | Imgs: ${p.images.length} | First: ${p.images[0]?.slice(0, 60)}...`);
  });

  process.exit(0);
}

syncAndClean().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
