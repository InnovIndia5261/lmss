import React, { useContext } from "react";
import { SkillTreeContext } from "@/context/SkillTreeContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiLock, FiCheck } from "react-icons/fi";

const SkillTreePage = () => {
  const { nodes, isSkillUnlocked, getUnlockedCount } = useContext(SkillTreeContext);
  const { user } = useAuth();
  const studentId = user?._id;
  const unlockedCount = getUnlockedCount(studentId);

  const rootNodes = nodes.filter((n) => !n.parentSkillId);
  const getChildren = (parentId) => nodes.filter((n) => n.parentSkillId === parentId);

  const SkillNode = ({ node, depth = 0 }) => {
    const unlocked = studentId ? isSkillUnlocked(node._id, studentId) : false;
    const children = getChildren(node._id);
    return (
      <div className={`${depth > 0 ? "ml-8 mt-4 border-l-2 border-gray-200 pl-4" : ""}`}>
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-75"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              unlocked ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
          >
            {unlocked ? <FiCheck size={24} /> : <FiLock size={24} />}
          </div>
          <div className="flex-1">
            <div className="font-bold">{node.title}</div>
            <div className="text-sm text-gray-600">{node.description}</div>
          </div>
        </div>
        {children.map((child) => (
          <SkillNode key={child._id} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">Skill Tree</h4>
        <p className="text-gray-600 mt-1">Track your learning progression</p>
        {studentId && (
          <div className="mt-2 text-sm font-medium text-indigo-600">
            {unlockedCount} / {nodes.length} skills unlocked
          </div>
        )}
      </div>
      <div className="px-8">
        <Card customClass="bg-white shadow">
          <div className="space-y-6">
            {rootNodes.map((node) => (
              <SkillNode key={node._id} node={node} />
            ))}
          </div>
          {nodes.length === 0 && <p className="text-center text-gray-500 py-12">No skills defined.</p>}
        </Card>
      </div>
    </div>
  );
};

export default SkillTreePage;
