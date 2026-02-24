import React, { useContext, useEffect, useState } from "react";
import { AIContext } from "@/context/AIContext";
import { GamificationContext } from "@/context/GamificationContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiZap, FiTarget, FiClock, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";
import Loader from "@/components/common/Loader";

const AIInsightsDashboard = () => {
  const { user } = useAuth();
  const { getTotalXP } = useContext(GamificationContext);
  const {
    recommendations,
    loading,
    error,
    generateLearningPath,
    getLearningPath,
  } = useContext(AIContext);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const existing = getLearningPath(user?._id);
    if (existing) setInsights(existing);
  }, [user?._id, getLearningPath, recommendations]);

  const handleGenerate = () => {
    if (user) {
      generateLearningPath(user._id).then((r) => r && setInsights(r));
    }
  };

  const riskLevelColor = (level) => {
    if (level === "high") return "bg-red-100 text-red-700";
    if (level === "medium") return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="px-6 py-8">
      <div className="page-header-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="heading-1 flex items-center gap-2">
            <FiZap className="text-indigo-600" /> AI Learning Intelligence
          </h4>
          <p className="label-muted mt-1">Personalized learning paths and insights</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <Loader fullscreen={false} /> : <FiZap size={18} />}
          {loading ? "Generating..." : "Generate My Path"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
          <FiAlertTriangle /> {error}
        </div>
      )}

      {insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card customClass="!p-6 card-featured">
            <div className="flex items-center gap-2 mb-2">
              <FiTarget className="text-indigo-600" size={20} />
              <h5 className="heading-2">Readiness</h5>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="metric-number">{insights.readinessPercent}%</span>
              <span className="text-sm text-gray-500">for {insights.careerPath || "target role"}</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full xp-progress-fill"
                style={{ width: `${insights.readinessPercent}%` }}
              />
            </div>
          </Card>

          <Card customClass="!p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiClock className="text-indigo-600" size={20} />
              <h5 className="heading-2">Time to Mastery</h5>
            </div>
            <p className="metric-number text-2xl">{insights.estimatedTimeToMastery}</p>
          </Card>

          <Card customClass="!p-6 md:col-span-2">
            <h5 className="heading-2 mb-3">Suggested Courses</h5>
            <ul className="space-y-2">
              {(insights.suggestedCourses || []).slice(0, 3).map((c, i) => (
                <li key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{c.title}</span>
                  <span className="badge-featured">{Math.round((c.relevance || 0) * 100)}% match</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card customClass="!p-6 md:col-span-2">
            <h5 className="heading-2 mb-3">Skill Gaps</h5>
            <ul className="space-y-2">
              {(insights.skillGaps || []).map((g, i) => (
                <li key={i} className="flex justify-between items-center py-2">
                  <span>{g.skill}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${g.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {g.priority}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : (
        <Card customClass="!p-12 text-center">
          <FiZap className="mx-auto text-4xl text-indigo-400 mb-4" />
          <h5 className="heading-2 mb-2">No insights yet</h5>
          <p className="text-gray-500 mb-4">Generate your personalized learning path based on your progress, XP, and enrolled courses.</p>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary">
            {loading ? "Generating..." : "Generate Learning Path"}
          </button>
        </Card>
      )}
    </div>
  );
};

export default AIInsightsDashboard;
