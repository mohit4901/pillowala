# 🛏️ Pillowala — Complete Pillow Business Platform

A complete, production-ready web platform for an Indian pillow brand (**Pillowala**) operating across **Amazon**, **Flipkart**, and **Meesho**.

The platform is divided into **three separate applications**:
1. `frontend` — Customer-facing brand website with a 5-step mobile-first QR code review experience.
2. `admin` — Private admin dashboard with real-time review analytics, approval/rejection moderation, and Excel (CSV/XLSX) export.
3. `backend` — Node.js, Express, and MongoDB REST API with JWT authentication, rate limiting, and Cloudinary image upload.

---

## 1. Project Architecture

```text
pillowala/
├── frontend/               # Customer React + Vite + Tailwind CSS v4 App
│   ├── src/
│   │   ├── components/     # Layout, Homepage, 5-Step Review, Common cards
│   │   ├── pages/          # Home, Products, Category, Offers, About, Contact, Review, Success
│   │   └── services/       # REST API client
│   ├── vite.config.js      # Uses @tailwindcss/vite (Port 5180)
│   └── package.json
│
├── admin/                  # Control Panel React + Vite + Tailwind CSS v4 App
│   ├── src/
│   │   ├── components/     # Sidebar with pending count, Header, Modals
│   │   ├── pages/          # Dashboard with Recharts, Reviews, Products, Categories, Offers
│   │   └── services/       # REST API client with JWT interceptors
│   ├── vite.config.js      # Uses @tailwindcss/vite (Port 5181)
│   └── package.json
│
└── backend/                # Node.js + Express REST API + MongoDB Atlas
    ├── config/             # MongoDB connection with auto-memory fallback, Cloudinary
    ├── controllers/        # Review, Product, Category, Offer, AdminAuth, Upload
    ├── middleware/         # JWT Auth, Rate Limiter, Multer Upload, Validators, ErrorHandler
    ├── models/             # Review, Product, Category, Offer, Admin
    ├── routes/             # REST endpoints
    ├── seeds/seed.js       # Realistic seed data across Amazon, Flipkart, Meesho
    ├── uploads/            # Local disk upload fallback directory
    └── server.js           # Main Express server (Port 5001)
```

---

## 2. Installation & Quick Start

### Step 1: Install Dependencies
From the project root, install dependencies for all three applications:

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Admin
cd admin && npm install && cd ..
```

### Step 2: Seed Initial Data
Seed 12 realistic products across Amazon, Flipkart, and Meesho, sample reviews, categories, active offers, and the default admin user:

```bash
cd backend && npm run seed && cd ..
```

### Step 3: Run Development Servers

Run each service in separate terminal windows:

```bash
# Terminal 1 — Backend (Port 5001)
cd backend && npm start

# Terminal 2 — Customer Frontend (Port 5180)
cd frontend && npm run dev

# Terminal 3 — Admin Dashboard (Port 5181)
cd admin && npm run dev
```

---

## 3. URLs & Ports

| Application | Local URL | Description |
|-------------|-----------|-------------|
| **Customer Website** | [http://localhost:5180](http://localhost:5180) | Customer catalog, brand story & reviews |
| **QR Review Page** | [http://localhost:5180/review](http://localhost:5180/review) | Destination for QR cards inside pillow packages |
| **Admin Control Panel** | [http://localhost:5181](http://localhost:5181) | Moderation table, analytics & Excel export |
| **Backend REST API** | [http://localhost:5001/api](http://localhost:5001/api) | Express + MongoDB API Server |

---

## 4. Admin Account Setup

The database is seeded with a default superadmin account:
- **URL**: `http://localhost:5181/login`
- **Email**: `admin@pillowala.com`
- **Password**: `Admin@12345`

*(A one-click "Auto-fill Default Admin Credentials" button is also provided on the login page for development convenience).*

---

## 5. Environment Variables Setup

### Backend (`backend/.env`):
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pillowala?retryWrites=true&w=majority
JWT_SECRET=pillowala_jwt_super_secret_dev_key_2026

# Cloudinary (Optional: automatically falls back to local disk storage if blank)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

*Note: If `MONGO_URI` is left blank, the backend automatically spins up an embedded in-memory MongoDB instance for immediate, zero-friction local testing.*

### Customer Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001/api
```

### Admin Dashboard (`admin/.env`):
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 6. Cloudinary Configuration

To store customer review photos in the cloud:
1. Create a free account on [Cloudinary](https://cloudinary.com).
2. Go to your Cloudinary Dashboard and copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Paste them into `backend/.env`.
4. When uploaded, images will be automatically optimized and resized to 1200×1200 in the `pillowala/reviews` cloud folder.

---

## 7. The Marketplace Review & Verification Bridge Flow

1. **Package Insert Card**: Inside every pillow box delivered via Amazon, Flipkart, or Meesho, a physical card is included with a QR code.
2. **Scan**: Customer scans the QR code with their mobile phone camera and arrives at:
   ```text
   https://YOUR-DOMAIN.com/review
   ```
3. **5-Step Mobile Review & Verification Flow**:
   - **Step 1 (Platform)**: Customer chooses where they bought: **Amazon**, **Flipkart**, or **Meesho**.
   - **Step 2 (Product)**: Catalog dynamically displays products available on that marketplace. Customer selects their pillow.
   - **Step 3 (Rate on Marketplace App)**:
     - Prominent button: **"Rate & Review on [Amazon / Flipkart / Meesho] ↗"** (opens the direct product review section on the marketplace in a new tab).
     - Customer leaves their 5-star rating and review directly on Amazon/Flipkart/Meesho to boost marketplace rankings!
     - Customer takes a screenshot of their submitted review.
   - **Step 4 (Upload Screenshot Proof)**: Customer uploads the screenshot of their marketplace review.
   - **Step 5 (Claim Warranty & Rewards)**:
     - Customer enters their **Marketplace Order ID** (e.g. `402-1234567-8901234` / `OD123456...`).
     - Customer enters their **Name** and **WhatsApp / Phone Number** to receive the reward voucher / 1-year pillow warranty certificate.
4. **Success Page (`/review/success`)**:
   - Confirms screenshot submission and queueing for verification.
   - Displays companion pillow recommendations from the **same** marketplace with direct "Buy on [Marketplace]" links.
5. **Admin Moderation & Excel Verification**:
   - Admin views the submitted screenshot in high-resolution, verifies the Order ID, customer phone, and rating.
   - Admin marks status as **Verified (Approved)** or **Rejected**.
   - Monthly **Export to XLSX / CSV** contains Order ID, Customer Phone, Marketplace, and Screenshot link for monthly bookkeeping and Amazon/Flipkart cross-referencing.

---

## 8. Monthly Review Export (Excel & CSV)

At the end of each month:
1. Log in to the Admin Dashboard: `http://localhost:5181/login`.
2. Navigate to **Reviews Moderation** in the sidebar.
3. Use the filter bar to select the date range (e.g., `Date From: 2026-09-01` to `Date To: 2026-09-30`), or filter by a specific marketplace like Amazon.
4. Click **Export XLSX (Excel)** or **Export CSV**.
5. The browser will immediately download a spreadsheet file (e.g., `pillowala-reviews-2026-09-19.xlsx`) with formatted column widths containing:
   - `Review ID`
   - `Date`
   - `Customer Name`
   - `Customer Email`
   - `Purchase Platform` (AMAZON / FLIPKART / MEESHO)
   - `Product Name`
   - `Rating` (1 to 5)
   - `Review Text`
   - `Image URL`
   - `Status` (APPROVED / PENDING / REJECTED)

---

## 9. Production Deployment

### Backend:
- Deploy to Render, Railway, AWS ECS, or DigitalOcean.
- Set environment variables (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `NODE_ENV=production`).
- Build command: `npm install`
- Start command: `npm start`

### Frontend & Admin:
- Deploy to Vercel, Netlify, or Cloudflare Pages.
- Root directory: `frontend` (or `admin`)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api-domain.com/api`
