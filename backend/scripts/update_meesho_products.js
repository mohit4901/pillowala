require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const MEESHO_PRODUCTS = [
  {
    code: 'bsh3um',
    url: 'https://www.meesho.com/bed-pillowcozy-pillow-16x24-2-pcs/p/bsh3um',
    name: 'Bed Pillow Cozy Pillow 16x24 (Set of 2)',
    categorySlug: 'pillows',
    price: 374,
    originalPrice: 599,
    rating: 4.4,
    reviewCount: 3820,
    images: [
      'https://images.meesho.com/images/products/709849246/5fuhp_512.avif?width=512',
      'https://images.meesho.com/images/products/709849246/3b3wz_512.avif?width=512',
      'https://images.meesho.com/images/products/709849246/g5g8q_512.avif?width=512',
      'https://images.meesho.com/images/products/709849246/1i13f_512.avif?width=512'
    ]
  },
  {
    code: '6qtopy',
    url: 'https://www.meesho.com/premium-bed-pillow-16x26-inch/p/6qtopy?ms=2&source=Meri+Shop',
    name: 'Premium Bed Pillow 16x26 Inch',
    categorySlug: 'pillows',
    price: 422,
    originalPrice: 699,
    rating: 4.5,
    reviewCount: 2190,
    images: [
      'https://images.meesho.com/images/products/415250494/g8z1c_512.avif?width=512',
      'https://images.meesho.com/images/products/415250494/7h02v_512.avif?width=512',
      'https://images.meesho.com/images/products/415250494/h6k3q_512.avif?width=512',
      'https://images.meesho.com/images/products/415250494/vbfdw_512.avif?width=512'
    ]
  },
  {
    code: '83hcc9',
    url: 'https://www.meesho.com/fibre-pillow-bed-pillow-16x26-inch/p/83hcc9?ms=2&source=Meri+Shop',
    name: 'Fibre Pillow Bed Pillow 16x26 Inch',
    categorySlug: 'pillows',
    price: 387,
    originalPrice: 599,
    rating: 4.3,
    reviewCount: 1450,
    images: [
      'https://images.meesho.com/images/products/489240873/9x1sp_512.avif?width=512',
      'https://images.meesho.com/images/products/489240873/qwtup_512.avif?width=512',
      'https://images.meesho.com/images/products/489240873/5uivl_512.avif?width=512'
    ]
  },
  {
    code: 'hnv6kg',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hnv6kg?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover (Zip Closer)',
    categorySlug: 'bedsheets',
    price: 654,
    originalPrice: 999,
    rating: 4.4,
    reviewCount: 890,
    images: [
      'https://images.meesho.com/images/products/1068019684/j41zg_512.avif?width=512',
      'https://images.meesho.com/images/products/1068019684/3owp0_512.avif?width=512'
    ]
  },
  {
    code: 'ho1lmw',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/ho1lmw?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer II',
    categorySlug: 'bedsheets',
    price: 644,
    originalPrice: 999,
    rating: 4.4,
    reviewCount: 760,
    images: [
      'https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512',
      'https://images.meesho.com/images/products/1068310472/qeeta_512.avif?width=512'
    ]
  },
  {
    code: 'ho5a6w',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/ho5a6w?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Floral Print',
    categorySlug: 'bedsheets',
    price: 664,
    originalPrice: 1049,
    rating: 4.5,
    reviewCount: 1120,
    images: [
      'https://images.meesho.com/images/products/1068482264/5pxb9_512.avif?width=512',
      'https://images.meesho.com/images/products/1068482264/nfx9h_512.avif?width=512'
    ]
  },
  {
    code: 'ag8mr5',
    url: 'https://www.meesho.com/cushion-16x16/p/ag8mr5?ms=2&source=Meri+Shop',
    name: 'Cushion 16x16 Soft Comfort Filler',
    categorySlug: 'pillows',
    price: 293,
    originalPrice: 499,
    rating: 4.2,
    reviewCount: 540,
    images: [
      'https://images.meesho.com/images/products/631938353/km1z2_512.avif?width=512'
    ]
  },
  {
    code: 'c9chsy',
    url: 'https://www.meesho.com/cotton-flat-bedsheet-90-x-95-inch-i-set-of-5-i-frill-decorated-pillow-and-cushion-cover-i-olive-green/p/c9chsy?ms=2&source=Meri+Shop',
    name: 'Cotton Flat Bedsheet 90 X 95 Inch Set of 5 (Frill Decorated Pillow & Cushion Covers) - Olive Green',
    categorySlug: 'bedsheets',
    price: 439,
    originalPrice: 699,
    rating: 4.5,
    reviewCount: 1680,
    images: [
      'https://images.meesho.com/images/products/741293602/w9eqn_512.avif?width=512',
      'https://images.meesho.com/images/products/741293602/zloyp_512.avif?width=512',
      'https://images.meesho.com/images/products/741293602/6jqsm_512.avif?width=512',
      'https://images.meesho.com/images/products/741293602/empcn_512.avif?width=512'
    ]
  },
  {
    code: 'hny264',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hny264?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer II',
    categorySlug: 'bedsheets',
    price: 654,
    originalPrice: 999,
    rating: 4.3,
    reviewCount: 640,
    images: [
      'https://images.meesho.com/images/products/1068145276/jpbft_512.avif?width=512',
      'https://images.meesho.com/images/products/1068145276/powjj_512.avif?width=512',
      'https://images.meesho.com/images/products/1068145276/vhv2e_512.avif?width=512',
      'https://images.meesho.com/images/products/1068145276/zqgzh_512.avif?width=512'
    ]
  },
  {
    code: 'hxyham',
    url: 'https://www.meesho.com/flannel-warm-fitted-bedsheet-ii-350-tc-with-2-matching-pillow-cover/p/hxyham?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Fitted Bedsheet 350 TC with 2 Matching Pillow Covers',
    categorySlug: 'bedsheets',
    price: 634,
    originalPrice: 999,
    rating: 4.4,
    reviewCount: 820,
    images: [
      'https://images.meesho.com/images/products/1084961038/je5ud_512.avif?width=512',
      'https://images.meesho.com/images/products/1084961038/pzbkr_512.avif?width=512',
      'https://images.meesho.com/images/products/1084961038/30awl_512.avif?width=512'
    ]
  },
  {
    code: 'c413d9',
    url: 'https://www.meesho.com/cotton-220tc-fitted-bedsheet-size-78x-72x6/p/c413d9?ms=2&source=Meri+Shop',
    name: 'Cotton 220TC Fitted Bedsheet (Size 78"x72"x6")',
    categorySlug: 'bedsheets',
    price: 257,
    originalPrice: 499,
    rating: 4.3,
    reviewCount: 1390,
    images: [
      'https://images.meesho.com/images/products/732363597/ps7xc_512.avif?width=512',
      'https://images.meesho.com/images/products/732363597/sfdkl_512.avif?width=512',
      'https://images.meesho.com/images/products/732363597/hdznb_512.avif?width=512',
      'https://images.meesho.com/images/products/732363597/8japg_512.avif?width=512'
    ]
  },
  {
    code: 'hqqdom',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hqqdom?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer',
    categorySlug: 'bedsheets',
    price: 625,
    originalPrice: 949,
    rating: 4.4,
    reviewCount: 710,
    images: [
      'https://images.meesho.com/images/products/1072825798/53c1x_512.avif?width=512',
      'https://images.meesho.com/images/products/1072825798/ahj0q_512.avif?width=512',
      'https://images.meesho.com/images/products/1072825798/xfkux_512.avif?width=512',
      'https://images.meesho.com/images/products/1072825798/bomuf_512.avif?width=512'
    ]
  },
  {
    code: 'gy9ngp',
    url: 'https://www.meesho.com/cotton-flat-bedsheet-with-frill-decorated-pillow/p/gy9ngp?ms=2&source=Meri+Shop',
    name: 'Cotton Flat Bedsheet with Frill Decorated Pillow Covers',
    categorySlug: 'bedsheets',
    price: 379,
    originalPrice: 599,
    rating: 4.3,
    reviewCount: 940,
    images: [
      'https://images.meesho.com/images/products/1025016073/9omsm_512.avif?width=512',
      'https://images.meesho.com/images/products/1025016073/g3eg1_512.avif?width=512',
      'https://images.meesho.com/images/products/1025016073/vtnjy_512.avif?width=512',
      'https://images.meesho.com/images/products/1025016073/o3sri_512.avif?width=512'
    ]
  },
  {
    code: 'fvy5y8',
    url: 'https://www.meesho.com/cotton-feel-bedsheet-90-90-frill-decorated-2-pillow-2-cushion-size-12x12-with-cushion-filler-5-pack-set/p/fvy5y8?ms=2&source=Meri+Shop',
    name: 'Cotton Feel Bedsheet (90x90) Frill Decorated 2 Pillows + 2 Cushions Set (5 Pack)',
    categorySlug: 'bedsheets',
    price: 424,
    originalPrice: 699,
    rating: 4.5,
    reviewCount: 2310,
    images: [
      'https://images.meesho.com/images/products/960654752/egint_512.avif?width=512',
      'https://images.meesho.com/images/products/960654752/ucykg_512.avif?width=512',
      'https://images.meesho.com/images/products/960654752/lh5k4_512.avif?width=512'
    ]
  },
  {
    code: 'hnyybz',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hnyybz?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer (Design 3)',
    categorySlug: 'bedsheets',
    price: 644,
    originalPrice: 999,
    rating: 4.4,
    reviewCount: 520,
    images: [
      'https://images.meesho.com/images/products/1068186959/dwnqz_512.avif?width=512',
      'https://images.meesho.com/images/products/1068186959/f9z9h_512.avif?width=512',
      'https://images.meesho.com/images/products/1068186959/qaahg_512.avif?width=512',
      'https://images.meesho.com/images/products/1068186959/bjnzi_512.avif?width=512'
    ]
  },
  {
    code: 'hqppoh',
    url: 'https://www.meesho.com/flannel-warm-velvet-fitted-bedsheet-with-pillow-cover-ii-zip-closer-ii/p/hqppoh?ms=2&source=Meri+Shop',
    name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer (Design 4)',
    categorySlug: 'bedsheets',
    price: 654,
    originalPrice: 999,
    rating: 4.3,
    reviewCount: 480,
    images: [
      'https://images.meesho.com/images/products/1072794689/m1x2l_512.avif?width=512',
      'https://images.meesho.com/images/products/1072794689/c5uaj_512.avif?width=512',
      'https://images.meesho.com/images/products/1072794689/4mba9_512.avif?width=512'
    ]
  },
  {
    code: 'c6i4yx',
    url: 'https://www.meesho.com/cotton-flat-bedsheet-size-90-100-with2-pillow-cover/p/c6i4yx?ms=2&source=Meri+Shop',
    name: 'Cotton Flat Bedsheet (Size 90x100) with 2 Pillow Covers',
    categorySlug: 'bedsheets',
    price: 294,
    originalPrice: 499,
    rating: 4.4,
    reviewCount: 1750,
    images: [
      'https://images.meesho.com/images/products/736518057/ha2su_512.avif?width=512',
      'https://images.meesho.com/images/products/736518057/qvppy_512.avif?width=512',
      'https://images.meesho.com/images/products/736518057/onixn_512.avif?width=512',
      'https://images.meesho.com/images/products/736518057/om5mw_512.avif?width=512'
    ]
  }
];

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');

  const pillowsCat = await Category.findOne({ slug: 'pillows' });
  const bedsheetsCat = await Category.findOne({ slug: 'bedsheets' });

  const catMap = {
    pillows: pillowsCat?._id,
    bedsheets: bedsheetsCat?._id,
  };

  let updatedCount = 0;
  let createdCount = 0;

  for (const item of MEESHO_PRODUCTS) {
    const categoryId = catMap[item.categorySlug] || pillowsCat?._id;

    // Look for existing product matching this product code in externalUrl
    const existing = await Product.findOne({
      $or: [
        { externalUrl: new RegExp(item.code, 'i') },
        { externalUrl: item.url }
      ]
    });

    if (existing) {
      existing.name = item.name;
      existing.price = item.price;
      existing.originalPrice = item.originalPrice;
      existing.images = item.images;
      existing.category = categoryId;
      existing.marketplace = 'meesho';
      existing.externalUrl = item.url;
      existing.rating = item.rating;
      existing.reviewCount = item.reviewCount;
      existing.isFeatured = true;
      existing.isActive = true;
      await existing.save();
      console.log(`[UPDATED] ${item.code} - ${item.name} (${item.images.length} images)`);
      updatedCount++;
    } else {
      await Product.create({
        name: item.name,
        description: `${item.name}. Genuine Meesho seller product by Pillowala with guaranteed quality and comfort.`,
        price: item.price,
        originalPrice: item.originalPrice,
        category: categoryId,
        images: item.images,
        marketplace: 'meesho',
        externalUrl: item.url,
        rating: item.rating,
        reviewCount: item.reviewCount,
        stock: 50,
        isFeatured: true,
        isActive: true,
      });
      console.log(`[CREATED] ${item.code} - ${item.name} (${item.images.length} images)`);
      createdCount++;
    }
  }

  console.log(`\nDONE! Updated: ${updatedCount}, Created: ${createdCount}, Total Meesho Products: ${MEESHO_PRODUCTS.length}`);

  // Print all Meesho products now in DB
  const allMeesho = await Product.find({ marketplace: 'meesho' });
  console.log(`\nVerification: Found ${allMeesho.length} Meesho products in database.`);
  allMeesho.forEach((p, idx) => {
    console.log(`${idx+1}. [${p.images.length} imgs] ${p.name.slice(0, 45)} (₹${p.price}) -> ${p.images[0]}`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error('Update script failed:', err);
  process.exit(1);
});
