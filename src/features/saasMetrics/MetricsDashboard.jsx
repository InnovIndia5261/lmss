import React, { useContext } from "react";
import { SaaSAnalyticsContext } from "@/context/SaaSAnalyticsContext";
import Card from "@/components/common/Card";
import { FiDollarSign, FiUsers, FiTrendingDown, FiDownload, FiZap } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";

const MetricsDashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "Admin";
  const {
    getMRR,
    getARR,
    getActiveUsers,
    getChurnRate,
    getPlanDistribution,
    getFeatureUsage,
    exportCSV,
  } = useContext(SaaSAnalyticsContext);

  const mrr = getMRR();
  const arr = getARR();
  const users = getActiveUsers();
  const churn = getChurnRate();
  const plans = getPlanDistribution();
  const usage = getFeatureUsage();

  if (!isAdmin) {
    return (
      <div className="px-6 py-8">
        <div className="page-header-subtle">
          <p className="text-gray-600">Access restricted. Admin only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
        <div className="page-header-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="heading-1">SaaS Metrics</h4>
            <p className="label-muted mt-1">Enterprise subscription analytics</p>
          </div>
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
            <FiDownload size={18} /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card customClass="!p-6 card-featured">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="text-indigo-600" size={20} />
              <h5 className="heading-2">MRR</h5>
            </div>
            <p className="metric-number">${mrr?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Monthly Recurring Revenue</p>
          </Card>
          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="text-indigo-600" size={20} />
              <h5 className="heading-2">ARR</h5>
            </div>
            <p className="metric-number">${arr?.toLocaleString()}</p>
          </Card>
          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-indigo-600" size={20} />
              <h5 className="heading-2">Active Users</h5>
            </div>
            <p className="metric-number">{users}</p>
          </Card>
          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingDown className="text-indigo-600" size={20} />
              <h5 className="heading-2">Churn Rate</h5>
            </div>
            <p className="metric-number">{churn}%</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card customClass="!p-6">
            <h5 className="heading-2 mb-4">Plan Distribution</h5>
            <div className="space-y-3">
              {plans.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{p.plan}</span>
                  <span className="text-sm text-gray-600">{p.count} seats · ${p.revenue}/mo</span>
                </div>
              ))}
            </div>
          </Card>
          <Card customClass="!p-6">
            <h5 className="heading-2 mb-4 flex items-center gap-2">
              <FiZap className="text-indigo-600" /> Feature Usage
            </h5>
            <div className="space-y-3">
              {usage.map((u, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{u.feature}</span>
                    <span>{u.count?.toLocaleString()} / {u.limit?.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full xp-progress-fill"
                      style={{ width: `${Math.min(100, (u.count / u.limit) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card customClass="!p-6">
          <h5 className="heading-2 mb-4">Upgrade Recommendation</h5>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <p className="text-sm text-indigo-800">
              Organizations approaching usage limits may benefit from upgrading to Pro or Enterprise for higher AI call quotas and storage.
            </p>
          </div>
        </Card>
      </div>
  );
};

export default MetricsDashboard;
