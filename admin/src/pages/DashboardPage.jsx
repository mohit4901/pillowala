import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Clock,
  Star,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import AdminHeader from '../components/layout/AdminHeader';
import { getReviewStats } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getReviewStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Dashboard Overview" subtitle="Real-time analytics and customer satisfaction metrics" />
        <div className="p-8 flex items-center justify-center flex-1">
          <div className="w-8 h-8 rounded-full border-4 border-amber-300 border-t-amber-600 animate-spin" />
        </div>
      </div>
    );
  }

  const {
    totalReviews = 0,
    reviewsThisMonth = 0,
    averageRating = 0,
    pendingReviews = 0,
    ratingDistribution = [],
    marketplaceDistribution = [],
    monthlyReviews = [],
    productReviews = [],
  } = stats || {};

  const MARKETPLACE_COLORS = {
    Amazon: '#FF9900',
    Flipkart: '#2874F0',
    Meesho: '#F43397',
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-stone-50">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Real-time feedback monitoring and marketplace distribution"
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Pending Review Alert Banner */}
        {pendingReviews > 0 && (
          <div className="bg-amber-500 text-stone-950 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-amber-400">
            <div className="flex items-center gap-3">
              <Clock size={20} className="font-bold" />
              <div>
                <span className="font-bold text-sm">
                  {pendingReviews} new customer {pendingReviews === 1 ? 'review' : 'reviews'} awaiting moderation!
                </span>
                <p className="text-xs text-stone-900 mt-0.5">
                  Check customer comments and photos before approving them for the public website.
                </p>
              </div>
            </div>
            <Link
              to="/reviews?status=pending"
              className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Moderate Pending</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Total Reviews
              </span>
              <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-stone-900 font-sans">{totalReviews}</div>
            <p className="text-xs text-stone-400 mt-1">Across all 3 channels</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Reviews This Month
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-stone-900 font-sans">{reviewsThisMonth}</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>Current monthly inflow</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Average Rating
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star size={16} className="fill-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-stone-900 font-sans flex items-center gap-2">
              <span>{averageRating}</span>
              <span className="text-amber-400 text-xl">★</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">Out of 5.0 maximum</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Pending Moderation
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-600 font-sans">{pendingReviews}</div>
            <p className="text-xs text-stone-400 mt-1">Awaiting approval</p>
          </div>
        </div>

        {/* Charts Row 1: Monthly Reviews Trend & Marketplace Share */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Trend Chart */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Monthly Review Volume</h3>
                <p className="text-xs text-stone-400">QR Code scan submission velocity</p>
              </div>
            </div>

            <div className="h-64 w-full">
              {monthlyReviews.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">
                  Not enough historical monthly data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyReviews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E1D1B',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reviews"
                      stroke="#8C4A2F"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8C4A2F' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Marketplace Distribution Chart */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Marketplace Distribution</h3>
              <p className="text-xs text-stone-400">Where customers bought their pillows</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketplaceDistribution}
                    dataKey="count"
                    nameKey="platform"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                  >
                    {marketplaceDistribution.map((entry) => (
                      <Cell
                        key={entry.platform}
                        fill={MARKETPLACE_COLORS[entry.platform] || '#6c757d'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1D1B',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              {marketplaceDistribution.map((item) => (
                <div key={item.platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: MARKETPLACE_COLORS[item.platform] || '#6c757d' }}
                    />
                    <span className="text-stone-700 font-medium">{item.platform}</span>
                  </div>
                  <span className="font-bold text-stone-900">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Star Rating Distribution & Product-wise Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rating Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Rating Breakdown</h3>
            <div className="space-y-3 pt-2">
              {ratingDistribution.map((r) => (
                <div key={r.star} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-1">
                      {r.star}
                    </span>
                    <span className="text-stone-500 font-mono">
                      {r.count} ({r.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product-wise Reviews Bar Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Product-Wise Review Inflow</h3>
            <div className="h-64 w-full">
              {productReviews.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">
                  No product review counts yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productReviews}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="productName"
                      type="category"
                      width={120}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => (val.length > 20 ? val.slice(0, 18) + '...' : val)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E1D1B',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#8C4A2F" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
