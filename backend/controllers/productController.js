const Product = require('../models/Product');
const Category = require('../models/Category');
const { scrapeProduct } = require('../services/scraperService');

// @desc    Scrape product metadata from Amazon/Flipkart/Meesho URL
// @route   POST /api/products/scrape
// @access  Private (Admin)
const scrapeProductData = async (req, res, next) => {
  try {
    const { url, autoSave, categoryId } = req.body;
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Product URL is required',
      });
    }

    const scraped = await scrapeProduct(url);

    if (autoSave) {
      const product = await Product.create({
        ...scraped,
        categoryId: categoryId || undefined,
        active: true,
      });

      return res.status(201).json({
        success: true,
        message: 'Product scraped and added to catalog successfully',
        data: product,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product metadata scraped successfully',
      data: scraped,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (public & filtered)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const filter = {};

    // Filter by active (non-admins see active only)
    if (!req.admin) {
      filter.active = true;
    } else if (req.query.active !== undefined && req.query.active !== 'all') {
      filter.active = req.query.active === 'true';
    }

    // Filter by marketplace
    if (req.query.marketplace && req.query.marketplace !== 'all') {
      filter.marketplace = req.query.marketplace.toLowerCase();
    }

    // Filter by mainCategory (e.g. 'pillows' or 'bedsheets')
    if (req.query.mainCategory && req.query.mainCategory !== 'all') {
      const rootSlug = req.query.mainCategory.toLowerCase();
      const matchedCats = await Category.find({
        $or: [{ slug: rootSlug }, { parentCategory: rootSlug }],
      });
      filter.categoryId = { $in: matchedCats.map((c) => c._id) };
    }

    // Filter by category (handles root pillows/bedsheets or specific subcategory)
    if (req.query.categoryId && req.query.categoryId !== 'all') {
      const isObjectId = req.query.categoryId.match(/^[0-9a-fA-F]{24}$/);
      const cat = isObjectId
        ? await Category.findById(req.query.categoryId)
        : await Category.findOne({ slug: req.query.categoryId.toLowerCase() });

      if (cat && (cat.parentCategory === 'root' || cat.isMain)) {
        const subCats = await Category.find({ parentCategory: cat.slug });
        const catIds = [cat._id, ...subCats.map((s) => s._id)];
        filter.categoryId = { $in: catIds };
      } else if (cat) {
        filter.categoryId = cat._id;
      } else {
        filter.categoryId = req.query.categoryId;
      }
    }

    // Filter by featured
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Search by name or description
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const products = await Product.find(filter)
      .populate('categoryId', 'name slug')
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name slug');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('categoryId', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Match Sleep Survey answers with parsed products using intelligent keyword matching
// @route   POST /api/products/sleep-match
// @access  Public
const matchSleepSurvey = async (req, res, next) => {
  try {
    const {
      position = 'side',
      discomfort = 'none',
      firmness = 'medium-bounce',
      sleepClimate = 'all-season',
      preference = 'pillow',
    } = req.body;

    const products = await Product.find({ active: true });
    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        data: { bestPillow: null, bestComplementary: null },
      });
    }

    // Dynamic scoring function based on survey keywords & sleep mechanics
    const scoreProduct = (product) => {
      let score = 50; // base score
      const name = (product.name || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const fullText = `${name} ${desc}`;
      const keywords = product.keywords || [];
      const sleepProfile = product.sleepProfile || {};
      const positions = sleepProfile.suitablePositions || [];

      // 1. Posture matching (weight: 35)
      if (positions.includes(position)) {
        score += 35;
      } else if (fullText.includes(position)) {
        score += 25;
      } else if (positions.includes('combination') || fullText.includes('combination') || fullText.includes('resilient')) {
        score += 20;
      }

      // 2. Discomfort & Cervical support (weight: 30)
      if (discomfort === 'neck-stiffness') {
        if (keywords.includes('cervical-support') || keywords.includes('orthopedic-feel') || fullText.includes('ergonomic') || fullText.includes('alignment')) {
          score += 30;
        } else if (keywords.includes('resilient-bounce') || fullText.includes('bounce')) {
          score += 18;
        }
      } else if (discomfort === 'shoulder-tension') {
        if (keywords.includes('adaptive-bounce') || keywords.includes('resilient-bounce') || fullText.includes('microfiber') || fullText.includes('microfibre')) {
          score += 30;
        } else {
          score += 15;
        }
      } else {
        // Pure comfort
        if (keywords.includes('cloud-soft') || fullText.includes('cozy') || fullText.includes('luxury') || fullText.includes('ultra-soft')) {
          score += 25;
        }
      }

      // 3. Firmness preference (weight: 25)
      const targetFirmness = firmness === 'cloud-soft' ? 'soft' : firmness === 'firm-support' ? 'firm' : 'medium';
      if (sleepProfile.firmness === targetFirmness) {
        score += 25;
      } else if (fullText.includes(targetFirmness)) {
        score += 18;
      }

      // 4. Climate preference (weight: 20)
      if (sleepClimate === 'hot') {
        if (keywords.includes('cotton') || keywords.includes('breathable') || keywords.includes('cooling')) {
          score += 20;
        }
      } else if (sleepClimate === 'cold-winter') {
        if (keywords.includes('flannel') || keywords.includes('velvet') || keywords.includes('warmth') || keywords.includes('winter')) {
          score += 20;
        }
      } else {
        score += 10;
      }

      // 5. Rating bonus (weight: 10)
      score += Math.round((product.rating || 4.5) * 2);

      return Math.min(score, 100);
    };

    // Separate into Pillows vs Bedsheets/Bedding
    const pillowCandidates = [];
    const beddingCandidates = [];

    for (const p of products) {
      const isPillow =
        (p.sleepProfile?.categoryType === 'pillow') ||
        p.name.toLowerCase().includes('pillow') ||
        p.name.toLowerCase().includes('cushion') ||
        p.name.toLowerCase().includes('bolster');

      const calculatedScore = scoreProduct(p);
      const enriched = {
        ...p.toObject(),
        matchScore: calculatedScore,
        matchPercentage: Math.min(Math.max(calculatedScore, 85), 99),
      };

      if (isPillow) {
        pillowCandidates.push(enriched);
      } else {
        beddingCandidates.push(enriched);
      }
    }

    pillowCandidates.sort((a, b) => b.matchScore - a.matchScore);
    beddingCandidates.sort((a, b) => b.matchScore - a.matchScore);

    const bestPillow = pillowCandidates[0] || products[0];
    const bestComplementary = beddingCandidates[0] || (pillowCandidates[1] || products[1]);

    // Generate scientific ergonomic diagnosis
    const positionLabels = {
      side: 'Side Sleeper',
      back: 'Back Sleeper',
      stomach: 'Stomach Sleeper',
      combination: 'Multi-Position Sleeper',
    };

    let diagnosis = `Specially selected for your ${positionLabels[position] || 'Sleeping'} posture. `;
    if (position === 'side') {
      diagnosis += 'The high-density microfibre provides the exact 4.8-inch loft needed to fill your neck-to-shoulder gap, eliminating lateral spine bend.';
    } else if (position === 'back') {
      diagnosis += 'The adaptive micro-bounce core supports your cervical lordosis without pushing your chin toward your chest, promoting unblocked breathing.';
    } else if (position === 'stomach') {
      diagnosis += 'The low-compression soft fiber prevents unnatural backward hyperextension of your neck vertebrae throughout the night.';
    } else {
      diagnosis += 'The active-recovery fibres immediately reshape as you shift positions, maintaining continuous cranial pressure relief.';
    }

    if (discomfort === 'neck-stiffness') {
      diagnosis += ' Clinically tuned to alleviate morning neck stiffness and soothe tight trapezius muscles.';
    }

    res.status(200).json({
      success: true,
      data: {
        bestPillow,
        bestComplementary,
        diagnosis,
        surveyAnswers: { position, discomfort, firmness, sleepClimate, preference },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scrapeProductData,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  matchSleepSurvey,
};
