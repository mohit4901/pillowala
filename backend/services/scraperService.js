const cheerio = require('cheerio');

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
];

const detectMarketplace = (url) => {
  const lower = url.toLowerCase();
  if (lower.includes('flipkart.com')) return 'flipkart';
  if (lower.includes('meesho.com')) return 'meesho';
  if (lower.includes('amazon.in') || lower.includes('amazon.com') || lower.includes('amzn.')) return 'amazon';
  return 'amazon'; // default fallback
};

// Pre-cached known product definitions for reliable demo & seed
const KNOWN_PRODUCTS = [
  {
    matcher: (url) => url.includes('7atwd7') || url.includes('441454363'),
    data: {
      name: '16x26 Fiber Pillow Pack of 2',
      description: 'Ultra-soft 16x26 fiber pillows with micro-bounce support. Value for money pack for daily sleeping comfort.',
      price: 387,
      originalPrice: 581,
      images: [
        'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/laqbh_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/nilot_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/bhf6i_512.avif?width=512',
      ],
      marketplace: 'meesho',
      rating: 4.3,
      reviewCount: 4634,
    },
  },
  {
    code: 'bsh3um',
    matcher: (url) => url.includes('bsh3um'),
    data: {
      name: 'Bed Pillow Cozy Pillow 16x24 (Set of 2)',
      description: 'Premium soft cozy bed pillows (set of 2) measuring 16x24 inches. Breathable fabric with fluffy resilient filling.',
      price: 374,
      originalPrice: 599,
      images: [
        'https://images.meesho.com/images/products/441454363/laqbh_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/bhf6i_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/nilot_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 3820,
    }
  },
  {
    code: '6qtopy',
    matcher: (url) => url.includes('6qtopy'),
    data: {
      name: 'Premium Bed Pillow 16x26 Inch',
      description: 'Luxurious ergonomic head support bed pillow. Engineered for deep restful sleep with high-grade microfibers.',
      price: 422,
      originalPrice: 699,
      images: [
        'https://images.meesho.com/images/products/441454363/nilot_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/laqbh_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/bhf6i_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.5,
      reviewCount: 2190,
    }
  },
  {
    code: '83hcc9',
    matcher: (url) => url.includes('83hcc9'),
    data: {
      name: 'Fibre Pillow Bed Pillow 16x26 Inch',
      description: 'Hypoallergenic soft fibre bed pillow with optimal neck cushioning.',
      price: 387,
      originalPrice: 599,
      images: [
        'https://images.meesho.com/images/products/441454363/bhf6i_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/laqbh_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512',
        'https://images.meesho.com/images/products/441454363/nilot_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.3,
      reviewCount: 1450,
    }
  },
  {
    code: 'hnv6kg',
    matcher: (url) => url.includes('hnv6kg'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover (Zip Closer)',
      description: 'Ultra-plush velvet winter flannel fitted bedsheet with all-around elastic and zip-closing pillow covers.',
      price: 654,
      originalPrice: 999,
      images: [
        'https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512',
        'https://images.meesho.com/images/products/1068310472/qeeta_512.avif?width=512',
        'https://images.meesho.com/images/products/1068145276/jpbft_512.avif?width=512',
        'https://images.meesho.com/images/products/1068145276/powjj_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 890,
    }
  },
  {
    code: 'ho1lmw',
    matcher: (url) => url.includes('ho1lmw'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer II',
      description: 'Warm velvet superfine floral fitted bedsheet with double king dimensions and zip-closer pillow covers.',
      price: 644,
      originalPrice: 999,
      images: [
        'https://images.meesho.com/images/products/1068310472/heg1i_512.avif?width=512',
        'https://images.meesho.com/images/products/1068310472/qeeta_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 760,
    }
  },
  {
    code: 'ho5a6w',
    matcher: (url) => url.includes('ho5a6w'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Floral Print',
      description: 'Floral velvet flannel winter bedsheet set with matching pillow covers and secure zipper.',
      price: 664,
      originalPrice: 1049,
      images: [
        'https://images.meesho.com/images/products/1068482264/5pxb9_512.avif?width=512',
        'https://images.meesho.com/images/products/1068482264/nfx9h_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.5,
      reviewCount: 1120,
    }
  },
  {
    code: 'ag8mr5',
    matcher: (url) => url.includes('ag8mr5'),
    data: {
      name: 'Cushion 16x16 Soft Comfort Filler',
      description: 'Bouncy 16x16 cushion filler ideal for sofas, couches, and beds.',
      price: 293,
      originalPrice: 499,
      images: [
        'https://images.meesho.com/images/products/631938353/km1z2_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.2,
      reviewCount: 540,
    }
  },
  {
    code: 'c9chsy',
    matcher: (url) => url.includes('c9chsy'),
    data: {
      name: 'Cotton Flat Bedsheet 90 X 95 Inch Set of 5 (Frill Decorated Pillow & Cushion Covers) - Olive Green',
      description: '100% Cotton olive green flat bedsheet set of 5 with fancy frill pillow and cushion covers.',
      price: 439,
      originalPrice: 699,
      images: [
        'https://images.meesho.com/images/products/741293602/w9eqn_512.avif?width=512',
        'https://images.meesho.com/images/products/741293602/zloyp_512.avif?width=512',
        'https://images.meesho.com/images/products/741293602/6jqsm_512.avif?width=512',
        'https://images.meesho.com/images/products/741293602/empcn_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.5,
      reviewCount: 1680,
    }
  },
  {
    code: 'hny264',
    matcher: (url) => url.includes('hny264'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer II',
      description: 'Premium heavyweight velvet flannel fitted sheet with 2 zipper pillow covers.',
      price: 654,
      originalPrice: 999,
      images: [
        'https://images.meesho.com/images/products/1068145276/jpbft_512.avif?width=512',
        'https://images.meesho.com/images/products/1068145276/powjj_512.avif?width=512',
        'https://images.meesho.com/images/products/1068145276/vhv2e_512.avif?width=512',
        'https://images.meesho.com/images/products/1068145276/zqgzh_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.3,
      reviewCount: 640,
    }
  },
  {
    code: 'hxyham',
    matcher: (url) => url.includes('hxyham'),
    data: {
      name: 'Flannel Warm Fitted Bedsheet 350 TC with 2 Matching Pillow Covers',
      description: '350 TC high density warm winter bedsheet with deep pockets and matching pillow covers.',
      price: 634,
      originalPrice: 999,
      images: [
        'https://images.meesho.com/images/products/1084961038/je5ud_512.avif?width=512',
        'https://images.meesho.com/images/products/1084961038/pzbkr_512.avif?width=512',
        'https://images.meesho.com/images/products/1084961038/30awl_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 820,
    }
  },
  {
    code: 'c413d9',
    matcher: (url) => url.includes('c413d9'),
    data: {
      name: 'Cotton 220TC Fitted Bedsheet (Size 78"x72"x6")',
      description: 'Pure cotton 220 TC snug fitted bedsheet with elastic edges.',
      price: 257,
      originalPrice: 499,
      images: [
        'https://images.meesho.com/images/products/732363597/ps7xc_512.avif?width=512',
        'https://images.meesho.com/images/products/732363597/sfdkl_512.avif?width=512',
        'https://images.meesho.com/images/products/732363597/hdznb_512.avif?width=512',
        'https://images.meesho.com/images/products/732363597/8japg_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.3,
      reviewCount: 1390,
    }
  },
  {
    code: 'hqqdom',
    matcher: (url) => url.includes('hqqdom'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer',
      description: 'Ultra-soft cozy winter velvet bedsheet with all-around elastic fit and 2 zip-closing pillow covers.',
      price: 625,
      originalPrice: 949,
      images: [
        'https://images.meesho.com/images/products/1072825798/53c1x_512.avif?width=512',
        'https://images.meesho.com/images/products/1072825798/ahj0q_512.avif?width=512',
        'https://images.meesho.com/images/products/1072825798/xfkux_512.avif?width=512',
        'https://images.meesho.com/images/products/1072825798/bomuf_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 710,
    }
  },
  {
    code: 'gy9ngp',
    matcher: (url) => url.includes('gy9ngp'),
    data: {
      name: 'Cotton Flat Bedsheet with Frill Decorated Pillow Covers',
      description: 'Traditional handcrafted cotton flat bedsheet with ruffled decorative borders on pillow covers.',
      price: 379,
      originalPrice: 599,
      images: [
        'https://images.meesho.com/images/products/1025016073/9omsm_512.avif?width=512',
        'https://images.meesho.com/images/products/1025016073/g3eg1_512.avif?width=512',
        'https://images.meesho.com/images/products/1025016073/vtnjy_512.avif?width=512',
        'https://images.meesho.com/images/products/1025016073/o3sri_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.3,
      reviewCount: 940,
    }
  },
  {
    code: 'fvy5y8',
    matcher: (url) => url.includes('fvy5y8'),
    data: {
      name: 'Cotton Feel Bedsheet (90x90) Frill Decorated 2 Pillows + 2 Cushions Set (5 Pack)',
      description: 'Complete 5-piece luxury bedroom combo with 90x90 bedsheet, 2 frill pillows, and 2 stuffed cushions.',
      price: 424,
      originalPrice: 699,
      images: [
        'https://images.meesho.com/images/products/960654752/egint_512.avif?width=512',
        'https://images.meesho.com/images/products/960654752/ucykg_512.avif?width=512',
        'https://images.meesho.com/images/products/960654752/lh5k4_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.5,
      reviewCount: 2310,
    }
  },
  {
    code: 'hnyybz',
    matcher: (url) => url.includes('hnyybz'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer (Design 3)',
      description: 'Designer winter warm velvet bedsheet with zipper pillowcases.',
      price: 644,
      originalPrice: 999,
      images: [
        'https://images.meesho.com/images/products/1068186959/dwnqz_512.avif?width=512',
        'https://images.meesho.com/images/products/1068186959/f9z9h_512.avif?width=512',
        'https://images.meesho.com/images/products/1068186959/qaahg_512.avif?width=512',
        'https://images.meesho.com/images/products/1068186959/bjnzi_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 520,
    }
  },
  {
    code: 'hqppoh',
    matcher: (url) => url.includes('hqppoh'),
    data: {
      name: 'Flannel Warm Velvet Fitted Bedsheet with Pillow Cover II Zip Closer (Design 4)',
      description: 'Soft touch velvet double bedsheet with zipper pillow covers and non-slip fitted contour.',
      price: 654,
      originalPrice: 999,
      images: [
        'https://images.meesho.com/images/products/1072794689/m1x2l_512.avif?width=512',
        'https://images.meesho.com/images/products/1072794689/c5uaj_512.avif?width=512',
        'https://images.meesho.com/images/products/1072794689/4mba9_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.3,
      reviewCount: 480,
    }
  },
  {
    code: 'c6i4yx',
    matcher: (url) => url.includes('c6i4yx'),
    data: {
      name: 'Cotton Flat Bedsheet (Size 90x100) with 2 Pillow Covers',
      description: 'Large 90x100 inch comfortable pure cotton flat sheet with matching pair of pillowcases.',
      price: 294,
      originalPrice: 499,
      images: [
        'https://images.meesho.com/images/products/736518057/ha2su_512.avif?width=512',
        'https://images.meesho.com/images/products/736518057/qvppy_512.avif?width=512',
        'https://images.meesho.com/images/products/736518057/onixn_512.avif?width=512',
        'https://images.meesho.com/images/products/736518057/om5mw_512.avif?width=512'
      ],
      marketplace: 'meesho',
      rating: 4.4,
      reviewCount: 1750,
    }
  },
  {
    matcher: (url) => url.includes('BDSHPAU5HBUCEM99'),
    data: {
      name: 'PILLOWALA Cotton Bedsheet with 2 Pillow Covers & 2 Cushion Covers',
      description: 'PILLOWALA Pure Cotton King/Queen Flat 200 TC Printed Summer Bedsheet with 2 Pillow Covers and 2 Cushion Covers. 100% genuine breathable fabric.',
      price: 424,
      originalPrice: 636,
      images: [
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg?q=70',
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/t/m/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5es6xuxxh.jpeg?q=70',
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/c/5/e/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5eqpfz4dj.jpeg?q=70',
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/z/e/f/frill-5-set-mavi-1-mavi-5-pcs-set-flat-pillowala-original-imahp8kh52g8zgse.jpeg?q=70',
      ],
      marketplace: 'flipkart',
      rating: 3.9,
      reviewCount: 25,
    },
  },
  {
    code: 'BDSHQWH6TZYHVMHS',
    matcher: (url) => url.includes('BDSHQWH6TZYHVMHS') || url.includes('itm14b625d21ae4f'),
    data: {
      name: 'PILLOWALA Fleece, Velvet King Fitted (Elastic) 350 TC Floral 1 Bedsheet with 2 Pillow Covers',
      description: 'Super warm velvet fleece king fitted bedsheet with all-around elastic and 2 matching pillow covers.',
      price: 628,
      originalPrice: 899,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/e/x/flannel-1-flannel-1001-fitted-elastic-pillowala-original-imahqwh4kyrad53g.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/o/y/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhknxxyz9yq.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/k/j/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkqhzfqgu7.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/j/u/i/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhk49qjcggc.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/w/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkxph37qd3.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.4,
      reviewCount: 412,
    }
  },
  {
    code: 'BDSHQXQ7QWB9PTMU',
    matcher: (url) => url.includes('BDSHQXQ7QWB9PTMU') || url.includes('itmdcf4784d7298b'),
    data: {
      name: 'PILLOWALA Velvet Single Fitted (Elastic) 350 TC Floral 1 Winter Bedsheet with 2 Pillow Covers',
      description: 'Velvet single fitted floral winter bedsheet with matching pillow covers.',
      price: 617,
      originalPrice: 999,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/4/8/f/flannel-1-flannel-2001-flat-pillowala-original-imahqwdc8es6mg8j.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/d/g/c/flannel-1-flannel-2001-flat-pillowala-original-imahqwdczpgtjvqc.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/o/d/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahbbhdv8s8.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/a/q/t/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqxq778yyqu6w.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/p/j/e/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkmrpnyjhm.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.3,
      reviewCount: 380,
    }
  },
  {
    code: 'BDSHP73YZZFYJHHR',
    matcher: (url) => url.includes('BDSHP73YZZFYJHHR') || url.includes('itm4a57b1b823bff'),
    data: {
      name: 'PILLOWALA Cotton Double, King, Queen Flat 200 TC Printed 1 Summer Bedsheet with 2 Pillow Covers',
      description: '100% breathable pure cotton flat summer bedsheet with botanical floral print and 2 pillow covers.',
      price: 501,
      originalPrice: 799,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/d/n/jazzz-1-jazz-forest-flower-flat-pillowala-original-imahp73yt3z89u9g.jpeg',
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg?q=70',
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/g/t/m/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5es6xuxxh.jpeg?q=70',
        'https://rukmini1.flixcart.com/image/1500/1500/xif0q/bedsheet/c/5/e/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5eqpfz4dj.jpeg?q=70'
      ],
      marketplace: 'flipkart',
      rating: 4.5,
      reviewCount: 890,
    }
  },
  {
    code: 'CPCHPBT5TNNSHVYF',
    matcher: (url) => url.includes('CPCHPBT5TNNSHVYF') || url.includes('itmdc619eda96b4a'),
    data: {
      name: 'PILLOWALA Cotton Bolsters Cover (Set of Bolster Covers)',
      description: 'Traditional printed cotton bolster covers designed with durable ties for Indian diwan and living setups.',
      price: 348,
      originalPrice: 522,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/u/e/e/mavi-5pc-bolster-set-green-1-mavi-5pc-bolster-set-green-flat-original-imahpbhjynx2aqyg.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/f/q/g/41-0-elephant-printed-bolsters-cover-kaytra-82-0-original-imahgsdrdbavhaud.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/7/h/f/mavi-5pc-bolster-set-green-1-mavi-5pc-bolster-set-green-flat-original-imahpbhjwxug2vvh.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/r/r/2/25-mavi-green-bolster-pillowala-82-original-imahpbt524222vhq.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/5/t/x/25-mavi-green-bolster-pillowala-82-original-imahpbt5svzxvvhf.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.3,
      reviewCount: 260,
    }
  },
  {
    code: 'BDSHQVHKNJJZQVZU',
    matcher: (url) => url.includes('BDSHQVHKNJJZQVZU') || url.includes('itmed74bc30f093c'),
    data: {
      name: 'PILLOWALA Woolen Double, Queen, King, Super King Fitted (Elastic) 350 TC Printed 1 Winter Bedsheet with 2 Pillow Covers',
      description: '350 TC woolen winter flannel bedsheet with elastic border hugging up to 10 inch mattresses.',
      price: 617,
      originalPrice: 926,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/k/j/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkqhzfqgu7.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/o/y/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhknxxyz9yq.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/j/u/i/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhk49qjcggc.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/w/z/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkxph37qd3.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.4,
      reviewCount: 310,
    }
  },
  {
    code: 'BDSHQXQ7HRGJ7RVR',
    matcher: (url) => url.includes('BDSHQXQ7HRGJ7RVR') || url.includes('itmaf855c9e6f92e'),
    data: {
      name: 'PILLOWALA Velvet Double Fitted (Elastic) 350 TC Floral 1 Bedsheet with 2 Pillow Covers',
      description: 'Double size floral velvet bedsheet with 2 pillowcases and snug elastic grips.',
      price: 609,
      originalPrice: 914,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/4/8/f/flannel-1-flannel-2001-flat-pillowala-original-imahqwdc8es6mg8j.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/d/g/c/flannel-1-flannel-2001-flat-pillowala-original-imahqwdczpgtjvqc.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/o/d/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahbbhdv8s8.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/a/q/t/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqxq778yyqu6w.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/p/j/e/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkmrpnyjhm.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.3,
      reviewCount: 290,
    }
  },
  {
    code: 'BDSHQWCE6SMPZDGV',
    matcher: (url) => url.includes('v9KtEyNNNN') || url.includes('BDSHQWCE6SMPZDGV') || url.includes('itmdf98e9982d2ee'),
    data: {
      name: 'PILLOWALA Woolen Double, Queen, King, Super King Fitted (Elastic) 350 TC Floral 1 Bedsheet with 2 Pillow Covers',
      description: 'Thick warm woolen fitted sheet with vivid floral prints and 2 pillowcases.',
      price: 630,
      originalPrice: 945,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/o/u/n/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahjahhqjgk.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/t/o/d/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahbbhdv8s8.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/y/d/1/flannel-3002-1-3002-fitted-elastic-pillowala-original-imahqwahejwscgdr.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/p/j/e/flannel-1-flannel-3001-fitted-elastic-pillowala-original-imahqvhkmrpnyjhm.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/e/h/n/falnnel-bedsheet-1-3001-w-green-fitted-elastic-pillowala-original-imahqqu44ya4vusd.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.4,
      reviewCount: 360,
    }
  },
  {
    code: 'CPCHQH82',
    matcher: (url) => url.includes('8x2!1iuuuN') || url.includes('CPCHQH82') || url.includes('itm77f6ea7f'),
    data: {
      name: 'PILLOWALA Cotton Bolsters Cover (25 Inch)',
      description: 'Ethnic printed jazz bolster cushion covers crafted from premium breathable cotton.',
      price: 222,
      originalPrice: 333,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/c/i/y/25-jazz-bolster-pillowala-82-original-imahqhhmbsdnyu88.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/n/f/p/25-bolster-y-jazz-pillowala-82-original-imahqfv9sxybrvxp.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/h/k/w/25-jazz-bolster-pillowala-82-original-imahqhhm2jy4z6hq.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/f/h/r/25-jazz-bolster-pillowala-82-original-imahqhhmsbhdvh9d.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/cushion-pillow-cover/t/n/u/25-bolster-y-jazz-pillowala-82-original-imahqfv99zb8cbvh.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.2,
      reviewCount: 180,
    }
  },
  {
    code: 'PLW2STRIPE',
    matcher: (url) => url.includes('8Ee7vkuuuN') || url.includes('PLW2STRIPE') || url.includes('navy-blue-stripe'),
    data: {
      name: 'PILLOWALA Polyester Fibre, Microfibre Sleeping Pillow Pack of 2 Stripes',
      description: 'Bouncy striped microfibre pillows for restorative neck & head alignment. Pack of 2.',
      price: 300,
      originalPrice: 450,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/j/b/e/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcduxcecpv.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/f/i/w/20-green-pillow-2-green-pillowala-original-imahmawsghuzhxct.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/o/l/u/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcrdqvcg3f.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/g/i/i/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcakf4vadf.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/pillow/p/d/p/20-blue-pil-low-2-navy-blue-stripe-pillowala-original-imahmagcepxyhtwe.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.5,
      reviewCount: 1240,
    }
  },
  {
    code: 'BDSHPAU55PC',
    matcher: (url) => url.includes('v95syrNNNN') || url.includes('BDSHPAU55PC') || url.includes('frill-mavi-green-5-set'),
    data: {
      name: 'PILLOWALA Cotton King, Queen, Double Flat 200 TC Printed Summer Bedsheet with 2 Pillow Covers & 2 Cushion Covers',
      description: '5-piece complete luxury bedding suite with 200 TC pure cotton flat bedsheet, 2 matching frill pillow covers, and 2 cushion covers.',
      price: 458,
      originalPrice: 687,
      images: [
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/j/l/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5yrzczqja.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/s/8/h/am-ft-955-1-am-ft-955-fitted-elastic-amrange-original-imahzm3tyzvjszxv.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/g/t/m/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5es6xuxxh.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/c/5/e/frill-mavi-green-5-set-1-green-5-set-flat-pillowala-original-imahpau5eqpfz4dj.jpeg',
        'https://rukminim2.flixcart.com/image/1500/1500/xif0q/bedsheet/z/e/f/frill-5-set-mavi-1-mavi-5-pcs-set-flat-pillowala-original-imahp8kh52g8zgse.jpeg'
      ],
      marketplace: 'flipkart',
      rating: 4.4,
      reviewCount: 780,
    }
  },
];

// Intelligent sleep ergonomics keyword & profile generator
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
  if (fullText.includes('fiber') || fullText.includes('fibre')) {
    keywords.add('fiber');
    keywords.add('cushioning');
  }
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

const scrapeProduct = async (url) => {
  if (!url || typeof url !== 'string') {
    throw new Error('Please provide a valid product URL');
  }

  const cleanUrl = url.trim();
  const marketplace = detectMarketplace(cleanUrl);

  // Check known products first for instant response
  for (const known of KNOWN_PRODUCTS) {
    if (known.matcher(cleanUrl)) {
      const meta = generateSleepMetadata(known.data);
      return {
        ...known.data,
        ...meta,
        externalUrl: cleanUrl,
      };
    }
  }

  const userAgent = USER_AGENTS[0];

  const headers = {
    'User-Agent': userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };

  let html = '';
  try {
    const response = await fetch(cleanUrl, {
      headers,
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      html = await response.text();
    }
  } catch (err) {
    console.warn(`Scraping network fetch failed for ${cleanUrl}:`, err.message);
  }

  // If page could not be fetched due to anti-bot protection or network, generate smart fallback
  if (!html) {
    let fallbackTitle = 'Pillowala Premium Product';
    try {
      const parsedUrl = new URL(cleanUrl);
      const pathname = decodeURIComponent(parsedUrl.pathname);
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        // e.g. /product-slug/dp/B08XYZ or /p/7atwd7
        const candidate = parts.find((p) => p.length > 4 && !['dp', 'product', 'p', 's', 'item'].includes(p));
        if (candidate) {
          fallbackTitle = candidate
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
      }
    } catch (_) {}

    return {
      name: fallbackTitle,
      description: `${fallbackTitle} available on ${marketplace.toUpperCase()}. High quality comfort and durability guaranteed by Pillowala.`,
      price: 499,
      originalPrice: 799,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop'],
      marketplace,
      externalUrl: cleanUrl,
      rating: 4.5,
      reviewCount: 48,
      fallbackUsed: true,
    };
  }
  const $ = cheerio.load(html);

  let name = '';
  let description = '';
  let price = 0;
  let originalPrice = 0;
  let images = [];
  let rating = 4.8;
  let reviewCount = 0;

  // 1. Try parsing JSON-LD scripts
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html();
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (item['@type'] === 'Product') {
          if (item.name) name = item.name;
          if (item.description) description = item.description;

          if (item.image) {
            const itemImages = Array.isArray(item.image) ? item.image : [item.image];
            itemImages.forEach((img) => {
              const imgUrl = typeof img === 'string' ? img : img.url;
              if (imgUrl && !images.includes(imgUrl)) images.push(imgUrl);
            });
          }

          if (item.offers) {
            const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offer && offer.price) {
              price = Number(offer.price);
            }
          }

          if (item.aggregateRating) {
            if (item.aggregateRating.ratingValue) {
              rating = Number(item.aggregateRating.ratingValue);
            }
            if (item.aggregateRating.reviewCount) {
              reviewCount = Number(item.aggregateRating.reviewCount);
            }
          }
        }
      }
    } catch (e) {
      // ignore json parse error on unrelated json-ld
    }
  });

  // 2. Fallback to OpenGraph and Meta tags
  if (!name) {
    name =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim() ||
      'Pillowala Product';
  }

  // Clean up title suffixes like "Online at Best Price in India | Flipkart.com" or "on Meesho"
  name = name
    .replace(/\s*\|\s*Flipkart\.com.*$/i, '')
    .replace(/\s*:\s*Buy .* at Best Price in India.*$/i, '')
    .replace(/\s*\|\s*Meesho.*$/i, '')
    .trim();

  if (!description) {
    description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';
  }

  // Clean description
  if (description) {
    description = description.replace(/^Name:\s*/i, '').trim();
  }

  if (images.length === 0) {
    const ogImg = $('meta[property="og:image"]').attr('content');
    if (ogImg) images.push(ogImg);
  }

  // 3. Extract price if not found in JSON-LD
  if (!price || price === 0) {
    // Look for price in Flipkart
    const fkPriceText = $('div[class*="_30jeq3"], div[class*="Nx9bqj"]').first().text();
    if (fkPriceText) {
      const parsed = Number(fkPriceText.replace(/[^0-9]/g, ''));
      if (parsed > 0) price = parsed;
    }

    // Look for price in Meesho
    const meeshoPriceText = $('h4[class*="Price"], span[class*="Price"]').first().text();
    if (meeshoPriceText) {
      const parsed = Number(meeshoPriceText.replace(/[^0-9]/g, ''));
      if (parsed > 0) price = parsed;
    }

    // Look for price in Amazon
    const amzPriceText = $('.a-price-whole').first().text();
    if (amzPriceText) {
      const parsed = Number(amzPriceText.replace(/[^0-9]/g, ''));
      if (parsed > 0) price = parsed;
    }
  }

  // Default price if still 0
  if (!price || price === 0) {
    price = 499;
  }

  if (!originalPrice || originalPrice <= price) {
    originalPrice = Math.round(price * 1.5);
  }

  const baseData = {
    name,
    description: description || `${name} by Pillowala. Authentic marketplace product.`,
    price,
    originalPrice,
    images: images.slice(0, 5),
    marketplace,
    externalUrl: url,
    rating: rating || 4.8,
    reviewCount: reviewCount || 50,
  };

  const meta = generateSleepMetadata(baseData);

  return {
    ...baseData,
    ...meta,
  };
};

module.exports = {
  detectMarketplace,
  scrapeProduct,
  generateSleepMetadata,
  KNOWN_PRODUCTS,
};
