import React, { useContext, useState } from "react";
import { CodeArenaContext } from "@/context/CodeArenaContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import CodeEditorModal from "./CodeEditorModal";
import { FiCode } from "react-icons/fi";

const CodeArenaPage = () => {
  const { problems, addSubmission } = useContext(CodeArenaContext);
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const filtered = problems.filter((p) => filter === "All" || p.difficulty === filter);

  const handleSubmit = (data) => {
    addSubmission({
      problemId: data.problemId,
      code: data.code,
      status: data.status,
      score: data.score ?? (data.status === "Accepted" ? 100 : 0),
      studentId: user?._id || "s1",
      language: "javascript",
    });
  };

  return (
    <div>
      <div className="page-header-subtle mx-4 px-8">
        <div className="flex items-center gap-3">
          <div className="icon-accent">
            <FiCode size={24} />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900">Code Arena</h4>
            <p className="text-gray-600 mt-0.5">Practice competitive coding</p>
          </div>
        </div>
      </div>
      <div className="px-8">
        <div className="flex gap-2 mb-6">
          {["All", "Easy", "Medium", "Hard"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filtered.map((p) => (
            <Card key={p._id} customClass="card-decorated card-accent-left p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg text-gray-900">{p.title}</div>
                  <p className="text-gray-600 text-sm mt-1">{p.description}</p>
                  <span className={`inline-block mt-2 ${p.difficulty === "Easy" ? "badge-easy" : p.difficulty === "Medium" ? "badge-medium" : "badge-hard"}`}>
                    {p.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProblem(p)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiCode size={18} /> Solve
                </button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm shadow-sm">
          <strong>Note:</strong> {selectedProblem ? "Write your solution and click Run to test, or Submit to save." : "Click Solve to open the code editor and run your solution."}
        </div>
      </div>

      <CodeEditorModal
        open={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        problem={selectedProblem}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CodeArenaPage;
