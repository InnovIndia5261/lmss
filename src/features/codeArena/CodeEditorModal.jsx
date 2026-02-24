import React, { useState, useEffect, useContext } from "react";
import { FiX, FiPlay, FiSend } from "react-icons/fi";
import { runCode, getStarterCode } from "./codeRunner";
import { DEMO_MODE } from "@/shared/utils/demo";
import { makeApiRequest } from "@/lib/api";
import { NotificationContext } from "@/components/common/Notification";

const CodeEditorModal = ({ open, onClose, problem, onSubmit }) => {
  const { toast } = useContext(NotificationContext);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (problem) setCode(getStarterCode(problem._id));
  }, [problem?._id]);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setStatus("");
    try {
      if (DEMO_MODE) {
        const result = await runCode(problem._id, code);
        setStatus(result.status);
        setOutput(result.output || result.error || "");
      } else {
        const { response, error } = await makeApiRequest({
          endpoint: "/code-arena/run",
          method: "POST",
          body: { problemId: problem._id, code, language: "javascript" },
        });
        if (error) {
          setStatus("Error");
          setOutput(error.message || "Request failed");
        } else {
          setStatus(response?.status || "Accepted");
          setOutput(response?.output || response?.message || "");
        }
      }
    } catch (err) {
      setStatus("Error");
      setOutput(err.message || "Execution failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("");
    setStatus("");
    try {
      if (DEMO_MODE) {
        const result = await runCode(problem._id, code);
        setStatus(result.status);
        setOutput(result.output || result.error || "");
        if (onSubmit) {
          onSubmit({
            problemId: problem._id,
            code,
            status: result.status,
            score: result.status === "Accepted" && result.passed === result.total ? 100 : 0,
            passed: result.passed,
            total: result.total,
          });
        }
        if (result.status === "Accepted") {
          toast?.("Accepted! Solution saved.");
        } else if (result.status === "Wrong Answer") {
          toast?.("Wrong Answer. Check the output and try again.");
        } else {
          toast?.("Submission recorded. Fix errors and resubmit.");
        }
      } else {
        const { response, error } = await makeApiRequest({
          endpoint: "/code-arena/submit",
          method: "POST",
          body: { problemId: problem._id, code, language: "javascript" },
        });
        if (error) {
          setStatus("Error");
          setOutput(error.message || "Submit failed");
          toast?.("Submit failed. Please try again.");
        } else {
          setStatus(response?.status || "Accepted");
          setOutput(response?.output || response?.message || "");
          if (onSubmit) onSubmit(response);
          toast?.(response?.status === "Accepted" ? "Accepted! Solution saved." : "Submission recorded.");
        }
      }
    } catch (err) {
      setStatus("Error");
      setOutput(err.message || "Submit failed");
      toast?.("Submit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode(getStarterCode(problem?._id));
    setOutput("");
    setStatus("");
    onClose();
  };

  if (!open || !problem) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 border border-gray-200/60 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 bg-gray-50/80 border-b border-gray-200/80">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{problem.title}</h2>
            <p className="text-sm text-gray-600 mt-0.5">{problem.description}</p>
            <span className={`inline-block mt-2 ${problem.difficulty === "Easy" ? "badge-easy" : problem.difficulty === "Medium" ? "badge-medium" : "badge-hard"}`}>
              {problem.difficulty}
            </span>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-200/80 rounded-xl transition-all duration-200">
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Code (JavaScript)</label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sample: {problem.sampleInput} → {problem.sampleOutput}</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-gray-50"
              placeholder="Write your solution..."
              spellCheck={false}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRun}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlay size={18} /> {loading ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-success flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={18} /> Submit
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Output</label>
            <pre className="panel-output w-full h-64 whitespace-pre-wrap">
              {output || "Click Run or Submit to see output."}
            </pre>
            {status && (
              <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                status === "Accepted" ? "bg-green-100 text-green-700" :
                status === "Wrong Answer" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              }`}>
                {status}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          {DEMO_MODE ? "Code runs in browser. Production uses backend judge." : "Code runs on backend."}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;
