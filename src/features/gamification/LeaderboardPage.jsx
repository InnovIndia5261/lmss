import React, { useContext } from "react";
import { GamificationContext } from "@/context/GamificationContext";
import Card from "@/components/common/Card";
import { FiAward, FiTrendingUp } from "react-icons/fi";

const LEADERBOARD_NAMES = { s1: "John Doe", s2: "Jane Smith", s3: "Emily Davis", "mock-user-123": "Explorer User" };

const LeaderboardPage = () => {
  const { getLeaderboard, getBadgesForStudent } = useContext(GamificationContext);
  const leaderboard = getLeaderboard(10);

  return (
    <div>
      <div className="page-header-subtle mx-4 px-8 mb-8">
        <h4 className="heading-1">Leaderboard</h4>
        <p className="text-gray-600 mt-1">Top performers this week</p>
      </div>
      <div className="px-8 max-w-2xl">
        <Card customClass="bg-white shadow">
          <div className="flex items-center gap-2 mb-6">
            <FiAward className="text-amber-500" size={24} />
            <h5 className="font-bold text-lg">Top 10</h5>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => {
              const badges = getBadgesForStudent(entry.studentId);
              return (
                <div
                  key={entry.studentId}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors duration-200 ${
                    idx === 0 ? "bg-amber-50 border border-amber-200" : idx < 3 ? "bg-gray-50" : "bg-white border border-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      idx === 0 ? "bg-amber-400 text-white" : idx === 1 ? "bg-gray-300" : idx === 2 ? "bg-amber-700 text-white" : "bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{LEADERBOARD_NAMES[entry.studentId] || entry.studentId}</div>
                    <div className="flex gap-1 mt-1">
                      {badges.slice(0, 3).map((b) => (
                        <span key={b._id} title={b.description} className="text-lg">
                          {b.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-bold">
                    <FiTrendingUp size={18} />
                    {entry.xp} XP
                  </div>
                </div>
              );
            })}
          </div>
          {leaderboard.length === 0 && <p className="text-center text-gray-500 py-8">No data yet.</p>}
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
