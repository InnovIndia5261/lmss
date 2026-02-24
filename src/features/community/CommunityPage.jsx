import React, { useContext } from "react";
import { Link } from "react-router";
import { CommunityContext } from "@/context/CommunityContext";
import { AcademicsContext } from "@/context/AcademicsContext";
import Card from "@/components/common/Card";
import { FiMessageCircle, FiAward, FiUsers, FiTrendingUp } from "react-icons/fi";

const CommunityPage = () => {
  const { getMentors, getGlobalLeaderboard } = useContext(CommunityContext);
  const { courses } = useContext(AcademicsContext);
  const mentors = getMentors();
  const leaderboard = getGlobalLeaderboard();

  return (
    <div className="px-6 py-8">
      <div className="page-header-subtle mb-8">
        <h4 className="heading-1 flex items-center gap-2">
          <FiMessageCircle className="text-indigo-600" /> Community
        </h4>
        <p className="label-muted mt-1">Discuss, learn, and grow together</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card customClass="!p-6">
          <h5 className="heading-2 mb-4 flex items-center gap-2">
            <FiMessageCircle className="text-indigo-600" /> Course Discussions
          </h5>
          <p className="text-sm text-gray-600 mb-4">Join discussions for your enrolled courses.</p>
          <div className="space-y-2">
            {(courses || []).slice(0, 5).map((c) => (
              <Link
                key={c._id}
                to={`/community/${c._id}`}
                className="block p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <span className="font-medium">{c.title}</span>
                <span className="text-xs text-gray-500 ml-2">→ Discuss</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card customClass="!p-6">
          <h5 className="heading-2 mb-4 flex items-center gap-2">
            <FiAward className="text-indigo-600" /> Reputation Leaderboard
          </h5>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((r, i) => (
              <div key={r.userId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium">#{i + 1} User {r.userId}</span>
                <span className="badge-featured">{r.points} pts</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card customClass="!p-6">
        <h5 className="heading-2 mb-4 flex items-center gap-2">
          <FiUsers className="text-indigo-600" /> Mentor Marketplace
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((m) => (
            <div
              key={m._id}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-500 mt-1">{m.expertise?.join(", ")}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs">★ {m.rating} · {m.sessions} sessions</span>
                <button className="btn-primary text-xs py-1 px-3">Book Session</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CommunityPage;
