import React, { useState, useContext } from "react";
import { AIContext } from "@/context/AIContext";
import useAuth from "@/hooks/useAuth";
import { FiMessageCircle, FiFileText, FiHelpCircle, FiList, FiZap } from "react-icons/fi";
import Card from "@/components/common/Card";

const AIStudyCopilot = ({ lessonContent, lessonTitle, onQuizGenerated }) => {
  const { user } = useAuth();
  const { summarizeLesson, generateQuizFromLesson, explainConcept } = useContext(AIContext);
  const [activeAction, setActiveAction] = useState(null);
  const [result, setResult] = useState("");
  const [conceptInput, setConceptInput] = useState("");

  const handleAction = async (action) => {
    setActiveAction(action);
    setResult("");
    try {
      if (action === "summarize") {
        const r = await summarizeLesson(lessonContent || "No content", user?._id);
        setResult(r || "Summary unavailable.");
      } else if (action === "quiz") {
        const r = await generateQuizFromLesson(lessonContent || "Sample content", 5, user?._id);
        if (r?.questions && onQuizGenerated) onQuizGenerated(r.questions);
        setResult(r ? `Generated ${r.questions?.length || 0} questions.` : "Quiz unavailable.");
      } else if (action === "explain" && conceptInput.trim()) {
        const r = await explainConcept(conceptInput.trim(), user?._id);
        setResult(r || "Explanation unavailable.");
      }
    } catch {
      setResult("Something went wrong. Please try again.");
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <Card customClass="!p-6">
      <h5 className="heading-2 mb-4 flex items-center gap-2">
        <FiZap className="text-indigo-600" /> AI Study Copilot
      </h5>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleAction("summarize")}
          disabled={activeAction === "summarize"}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiFileText size={16} /> Summarize
        </button>
        <button
          onClick={() => handleAction("quiz")}
          disabled={activeAction === "quiz"}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiList size={16} /> Generate Quiz
        </button>
      </div>
      <div className="space-y-2">
        <label className="label-muted block">Explain a concept:</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Recursion, OOP..."
            value={conceptInput}
            onChange={(e) => setConceptInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAction("explain")}
            disabled={!conceptInput.trim() || activeAction === "explain"}
            className="btn-secondary text-sm"
          >
            Explain
          </button>
        </div>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-700 border border-gray-200">
          {result}
        </div>
      )}
    </Card>
  );
};

export default AIStudyCopilot;
