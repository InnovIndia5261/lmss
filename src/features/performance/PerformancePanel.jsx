import React, { useContext } from "react";
import { PerformanceContext } from "@/context/PerformanceContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiTrendingUp, FiAlertTriangle, FiTarget } from "react-icons/fi";

const RISK_COLORS = { Low: "bg-green-100 text-green-800", Medium: "bg-amber-100 text-amber-800", High: "bg-red-100 text-red-800" };

const PerformancePanel = () => {
  const { getProfileByStudent } = useContext(PerformanceContext);
  const { user } = useAuth();
  const profile = user ? getProfileByStudent(user._id) : null;

  if (!profile) return null;

  return (
    <Card customClass="bg-white shadow">
      <h5 className="font-bold mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-indigo-500" />
        AI Performance Insights
      </h5>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Overall Score</span>
          <span className="font-bold text-indigo-600">{profile.overallScore}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Risk Level</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${RISK_COLORS[profile.riskLevel] || "bg-gray-100"}`}>
            {profile.riskLevel}
          </span>
        </div>
        {profile.strengths?.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Strengths</div>
            <div className="flex flex-wrap gap-2">
              {profile.strengths.map((s) => (
                <span key={s} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.weaknesses?.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
              <FiAlertTriangle size={14} /> Areas to Improve
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.weaknesses.map((w) => (
                <span key={w} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <FiTarget size={14} />
            Tip: Focus on {profile.weaknesses?.[0] || "practice"} to improve your score.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformancePanel;
