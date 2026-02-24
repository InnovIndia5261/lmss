import React, { useContext } from "react";
import { PlagiarismContext } from "@/context/PlagiarismContext";
import { AcademicsContext } from "@/context/AcademicsContext";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { FiAlertTriangle } from "react-icons/fi";

const PlagiarismReviewPage = () => {
  const { getFlaggedReports, threshold } = useContext(PlagiarismContext);
  const { submissions } = useContext(AcademicsContext);
  const flagged = getFlaggedReports();

  const getSubmission = (id) => submissions.find((s) => s._id === id);

  const columns = [
    { label: "Submission", key: "submissionId", renderDetail: (r) => getSubmission(r.submissionId)?.studentName || r.submissionId },
    { label: "Similarity", key: "similarityScore", renderDetail: (r) => <span className={r.similarityScore >= threshold ? "text-red-600 font-bold" : ""}>{r.similarityScore}%</span> },
    { label: "Flagged", key: "flagged", renderDetail: (r) => (r.flagged ? <span className="text-red-600">Yes</span> : "No") },
    { label: "Matched", key: "matchedSubmissionIds", renderDetail: (r) => r.matchedSubmissionIds?.length || 0 },
  ];

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">Plagiarism Review</h4>
        <p className="text-gray-600 mt-1">Flagged submissions (threshold: {threshold}%)</p>
      </div>
      <div className="px-8">
        <Card customClass="bg-white shadow">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="text-amber-500" size={24} />
            <h5 className="font-bold">Flagged Reports</h5>
          </div>
          <Table columns={columns} data={flagged} />
          {flagged.length === 0 && <p className="text-center text-gray-500 py-8">No flagged submissions.</p>}
        </Card>
      </div>
    </div>
  );
};

export default PlagiarismReviewPage;
