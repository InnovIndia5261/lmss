import React, { useContext, useEffect, useState } from "react";
import { AIContext } from "@/context/AIContext";
import { GamificationContext } from "@/context/GamificationContext";
import { AcademicsContext } from "@/context/AcademicsContext";
import { FiAlertTriangle } from "react-icons/fi";

const DropoutRiskBadge = ({ studentId, studentName }) => {
  const { predictDropoutRisk } = useContext(AIContext);
  const { getTotalXP } = useContext(GamificationContext);
  const { examAttempts, submissions } = useContext(AcademicsContext);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    const attempts = examAttempts?.filter((a) => a.studentId === studentId) || [];
    const failed = attempts.filter((a) => (a.score || 0) < (a.passingMarks || 60)).length;
    const totalXP = getTotalXP(studentId);
    predictDropoutRisk(studentId, {
      failedExams: failed,
      xpGrowth: totalXP,
      inactivityDays: 3,
    }).then(setRisk);
  }, [studentId, predictDropoutRisk, getTotalXP, examAttempts]);

  if (!risk || risk.level === "low") return null;

  const colorClass = risk.level === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
      <FiAlertTriangle size={12} />
      {risk.level} risk ({risk.riskScore}%)
    </div>
  );
};

export default DropoutRiskBadge;
