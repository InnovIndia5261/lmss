import React, { useContext } from "react";
import { AnalyticsContext } from "@/context/AnalyticsContext";
import Card from "@/components/common/Card";
import { FiBarChart2, FiDownload } from "react-icons/fi";

const AdminAnalyticsPage = () => {
  const { snapshots, getSnapshot } = useContext(AnalyticsContext);
  const [range, setRange] = React.useState("30d");

  const revenue = getSnapshot("revenue_trends");
  const users = getSnapshot("user_growth");

  return (
    <div className="px-6 py-8">
      <div className="page-header-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="heading-1">Analytics</h4>
          <p className="label-muted mt-1">BI Dashboard</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                range === r ? "btn-primary" : "btn-secondary"
              }`}
            >
              {r}
            </button>
          ))}
          <button className="btn-secondary flex items-center gap-2">
            <FiDownload size={18} /> Export CSV
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card customClass="!p-6">
          <h5 className="heading-2 mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-indigo-600" /> Revenue Trends
          </h5>
          <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            Chart placeholder (Recharts)
          </div>
          {revenue?.dataJSON && (
            <div className="mt-2 text-sm text-gray-600">
              Data: {JSON.stringify(revenue.dataJSON.values)}
            </div>
          )}
        </Card>
        <Card customClass="!p-6">
          <h5 className="heading-2 mb-4">User Growth</h5>
          <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            Chart placeholder
          </div>
          {users?.dataJSON && (
            <div className="mt-2 text-sm text-gray-600">
              Data: {JSON.stringify(users.dataJSON.values)}
            </div>
          )}
        </Card>
        <Card customClass="!p-6 md:col-span-2">
          <h5 className="heading-2 mb-4">Course Completion Heatmap</h5>
          <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            Heatmap placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
