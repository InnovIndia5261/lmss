import React, { useContext } from "react";
import { NavLink } from "react-router";
import { FiLogOut } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { GamificationContext } from "../context/GamificationContext";
import DemoModeBanner from "./DemoModeBanner";

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const { getTotalXP, getLevelFromXP, getXPProgressInLevel, XP_PER_LEVEL } = useContext(GamificationContext);
  const totalXP = user ? getTotalXP(user._id) : 0;
  const level = getLevelFromXP(totalXP);
  const progress = getXPProgressInLevel(totalXP);
  const canManage = user?.role === "admin" || user?.role === "Admin" || user?.role === "staff" || user?.role === "Staff";

  const activeStyle = ({ isActive }) => {
    return {
      borderLeft: isActive ? "3px solid #4f46e5" : "3px solid transparent",
      ...(isActive ? {
        background: "linear-gradient(to right, rgba(99, 102, 241, 0.1), transparent)",
        fontWeight: 600,
      } : {}),
    };
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav
      style={{ position: "fixed" }}
      className="w-[250px] h-[100vh] bg-white/80 dark:bg-slate-900/95 backdrop-blur-md px-2 flex flex-col border-r border-gray-200/80 dark:border-slate-700 shadow-sm"
    >
      <DemoModeBanner />
      <h3 className="text-xl font-semibold mb-4 p-4 flex-shrink-0 text-gray-800 tracking-tight">LMS</h3>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="flex flex-col gap-1 pb-2">
          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/"
          >
            Dashboard
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/transactions"
          >
            Transactions
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/courses"
          >
            Courses
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/my-learning"
          >
            My Learning
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/leaderboard"
          >
            Leaderboard
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/skill-tree"
          >
            Skill Tree
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/live-classes"
          >
            Live Classes
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/daily-review"
          >
            Daily Review
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/code-arena"
          >
            Code Arena
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/ai-insights"
          >
            AI Insights
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/community"
          >
            Community
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/external-learning"
          >
            External Learning
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/research"
          >
            Research Hub
          </NavLink>

          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/my-research"
          >
            My Research
          </NavLink>

          {canManage && (
            <NavLink
              style={activeStyle}
              className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
              to="/plagiarism"
            >
              Plagiarism
            </NavLink>
          )}

          {user?.role !== "Member" && user?.role !== "member" && (
            <NavLink
              style={activeStyle}
              className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
              to="/members"
            >
              Members
            </NavLink>
          )}
          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/profile"
          >
            Profile
          </NavLink>
          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/favorites"
          >
            Favorites
          </NavLink>
          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/reports"
          >
            Reports
          </NavLink>
          {canManage && (
            <>
              <NavLink
                style={activeStyle}
                className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
                to="/admin/analytics"
              >
                Analytics
              </NavLink>
              <NavLink
                style={activeStyle}
                className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
                to="/admin/saas-metrics"
              >
                SaaS Metrics
              </NavLink>
              <NavLink
                style={activeStyle}
                className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
                to="/admin/organizations/org-1/insights"
              >
                Org Insights
              </NavLink>
            </>
          )}
          {(user?.role === "admin" || user?.role === "Admin") && (
            <>
              <NavLink
                style={activeStyle}
                className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
                to="/admin/external-learning"
              >
                External Learning Admin
              </NavLink>
              <NavLink
                style={activeStyle}
                className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
                to="/admin/research"
              >
                Research Hub Admin
              </NavLink>
            </>
          )}
          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/pricing"
          >
            Pricing
          </NavLink>
          <NavLink
            style={activeStyle}
            className="p-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100/60 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
            to="/settings"
          >
            Settings
          </NavLink>
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-gray-200 pt-4 pb-2">
      {user && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Level {level}</span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{totalXP} XP</span>
          </div>
          <div className="xp-progress-bar">
            <div
              className="xp-progress-fill"
              style={{ width: `${(progress / XP_PER_LEVEL) * 100}%` }}
            />
          </div>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mx-2 mb-2 w-[calc(100%-1rem)] border border-gray-200 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-50/80 transition-all duration-200"
      >
        <FiLogOut size={18} /> Logout
      </button>
      </div>
    </nav>
  );
};

export default Sidebar;
