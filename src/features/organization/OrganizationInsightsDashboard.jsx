import React, { useContext } from "react";
import { useParams } from "react-router";
import { OrganizationContext } from "@/context/OrganizationContext";
import Card from "@/components/common/Card";
import { FiTrendingUp, FiUsers, FiZap, FiDollarSign } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import { demoOrganizationInsights } from "@/lib/demoData/organizationInsights";

const OrganizationInsightsDashboard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getOrgById } = useContext(OrganizationContext);
  const isAdmin = user?.role === "admin" || user?.role === "Admin";
  const org = getOrgById(id);
  const insights = demoOrganizationInsights[id] || {
    performanceScore: 0,
    skillHeatmap: [],
    departments: [],
    seatUtilization: 0,
    aiUsageThisMonth: 0,
    revenue: 0,
  };

  if (!org) return <div className="p-8">Organization not found</div>;
  if (!isAdmin) return <div className="p-8">Access restricted. Admin only.</div>;

  return (
      <div className="px-6 py-8">
        <div className="page-header-subtle mb-8">
          <h4 className="heading-1">Organization Insights: {org.name}</h4>
          <p className="label-muted mt-1">Executive summary and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card customClass="!p-6 card-featured">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="text-indigo-600" size={20} />
              <h5 className="heading-2">Performance Score</h5>
            </div>
            <p className="metric-number">{insights.performanceScore}%</p>
          </Card>
          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-indigo-600" size={20} />
              <h5 className="heading-2">Seat Utilization</h5>
            </div>
            <p className="metric-number">{insights.seatUtilization}%</p>
          </Card>
          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="text-indigo-600" size={20} />
              <h5 className="heading-2">AI Usage</h5>
            </div>
            <p className="metric-number">{insights.aiUsageThisMonth?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </Card>
          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="text-indigo-600" size={20} />
              <h5 className="heading-2">Revenue</h5>
            </div>
            <p className="metric-number">${insights.revenue}</p>
            <p className="text-xs text-gray-500 mt-1">MRR</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card customClass="!p-6">
            <h5 className="heading-2 mb-4">Skill Heatmap</h5>
            <div className="space-y-3">
              {(insights.skillHeatmap || []).map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.skill}</span>
                    <span>{s.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full xp-progress-fill"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card customClass="!p-6">
            <h5 className="heading-2 mb-4">Department Comparison</h5>
            <div className="space-y-3">
              {(insights.departments || []).map((d, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-sm text-gray-600">{d.avgProgress}% avg · {d.learners} learners</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
  );
};

export default OrganizationInsightsDashboard;
