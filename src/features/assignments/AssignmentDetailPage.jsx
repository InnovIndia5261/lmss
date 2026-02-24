import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { AcademicsContext } from "@/context/AcademicsContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Loader from "@/components/common/Loader";

const STATUS_BADGES = {
  Pending: "bg-gray-200 text-gray-700",
  Submitted: "bg-blue-200 text-blue-800",
  Graded: "bg-green-200 text-green-800",
  Late: "bg-red-200 text-red-800",
};

const AssignmentDetailPage = () => {
  const { courseId, assignmentId } = useParams();
  const { assignments, submissions, gradeSubmission, submitAssignment } = useContext(AcademicsContext);
  const { user } = useAuth();
  const [gradeModal, setGradeModal] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: "", feedback: "" });
  const [submitForm, setSubmitForm] = useState({ textAnswer: "" });

  const assignment = assignments.find((a) => a._id === assignmentId && a.courseId === courseId);
  const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignmentId);
  const mySubmission = assignmentSubmissions.find((s) => s.studentId === user?._id);
  const canGrade = user?.role === "admin" || user?.role === "Admin" || user?.role === "staff" || user?.role === "Staff";
  const isPastDue = assignment && new Date() > new Date(assignment.dueDate);

  const handleGrade = () => {
    if (!gradeModal || !gradeForm.marks) return;
    gradeSubmission(gradeModal._id, Number(gradeForm.marks), gradeForm.feedback, user?._id);
    setGradeModal(null);
    setGradeForm({ marks: "", feedback: "" });
  };

  const avgScore =
    assignmentSubmissions.filter((s) => s.marks != null).length > 0
      ? Math.round(
          assignmentSubmissions
            .filter((s) => s.marks != null)
            .reduce((a, s) => a + s.marks, 0) / assignmentSubmissions.filter((s) => s.marks != null).length
        )
      : null;
  const submissionRate =
    assignmentSubmissions.length > 0
      ? Math.round(
          (assignmentSubmissions.filter((s) => s.status !== "Pending").length / assignmentSubmissions.length) * 100
        )
      : 0;

  if (!assignment) return <Loader />;

  const columns = [
    { label: "Student", key: "studentName" },
    { label: "Status", key: "status", renderDetail: (r) => <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGES[r.status] || "bg-gray-200"}`}>{r.status}</span> },
    { label: "Marks", key: "marks", renderDetail: (r) => r.marks ?? "-" },
    { label: "Submitted", key: "submittedAt", renderDetail: (r) => (r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "-") },
    ...(canGrade
      ? [
          {
            label: "Action",
            key: "_id",
            renderDetail: (r) =>
              r.status === "Submitted" ? (
                <button
                  onClick={() => setGradeModal(r)}
                  className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
                >
                  Grade
                </button>
              ) : (
                "-"
              ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">{assignment.title}</h4>
        <p className="text-gray-600 mt-1">{assignment.description}</p>
        <div className="flex flex-wrap gap-4 mt-2">
          <span className="flex items-center gap-1 text-sm">
            <FiClock /> Due: {new Date(assignment.dueDate).toLocaleString()}
          </span>
          <span className="text-sm">{assignment.maxMarks} marks</span>
          {assignment.allowLateSubmission && (
            <span className="text-sm text-amber-600">Late penalty: {assignment.latePenaltyPercent}%</span>
          )}
        </div>
      </div>

      <div className="px-8 space-y-6">
        {canGrade && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card customClass="bg-white shadow">
              <h5 className="font-bold mb-2">Assignment Analytics</h5>
              <div className="text-2xl font-bold text-indigo-600">{avgScore ?? "-"}</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </Card>
            <Card customClass="bg-white shadow">
              <h5 className="font-bold mb-2">Submission Rate</h5>
              <div className="text-2xl font-bold text-indigo-600">{submissionRate}%</div>
              <div className="text-sm text-gray-600">Submitted</div>
            </Card>
          </div>
        )}

        {canGrade ? (
          <Card customClass="bg-white shadow">
            <h5 className="font-bold mb-4">Submissions</h5>
            <Table columns={columns} data={assignmentSubmissions} />
          </Card>
        ) : (
          <Card customClass="bg-white shadow">
            <h5 className="font-bold mb-4">Your Submission</h5>
            {mySubmission ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className={`px-2 py-1 rounded text-sm ${STATUS_BADGES[mySubmission.status]}`}>
                    {mySubmission.status}
                  </span>
                  {mySubmission.isLate && <span className="text-red-600 text-sm">Late</span>}
                </div>
                {mySubmission.textAnswer && <p className="text-gray-600">{mySubmission.textAnswer}</p>}
                {mySubmission.marks != null && <p className="font-medium">Marks: {mySubmission.marks}/{assignment.maxMarks}</p>}
                {mySubmission.feedback && <p className="text-sm text-gray-600">Feedback: {mySubmission.feedback}</p>}
              </div>
            ) : (
              <div>
                {isPastDue && !assignment.allowLateSubmission ? (
                  <p className="text-red-600">Submission closed. Due date has passed.</p>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Answer</label>
                    <textarea
                      value={submitForm.textAnswer}
                      onChange={(e) => setSubmitForm({ textAnswer: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Type your answer or paste link to file..."
                    />
                    <button
                      onClick={() => {
                        if (submitForm.textAnswer && user) {
                          submitAssignment(assignmentId, user._id, user.name, { textAnswer: submitForm.textAnswer });
                          setSubmitForm({ textAnswer: "" });
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Grade Submission">
        {gradeModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Grading: {gradeModal.studentName}</p>
            <div>
              <label className="block text-sm font-medium mb-1">Marks (max {assignment.maxMarks})</label>
              <input
                type="number"
                value={gradeForm.marks}
                onChange={(e) => setGradeForm((p) => ({ ...p, marks: e.target.value }))}
                max={assignment.maxMarks}
                min={0}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Feedback</label>
              <textarea
                value={gradeForm.feedback}
                onChange={(e) => setGradeForm((p) => ({ ...p, feedback: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handleGrade}
              className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Submit Grade
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssignmentDetailPage;
