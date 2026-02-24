import React, { useContext, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { AcademicsContext } from "@/context/AcademicsContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Loader from "@/components/common/Loader";

const ExamAttemptPage = () => {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const { exams, questions, examAttempts, submitExamAttempt } = useContext(AcademicsContext);
  const { user } = useAuth();

  const exam = exams.find((e) => e._id === examId && e.courseId === courseId);
  const examQuestions = questions
    .filter((q) => q.examId === examId)
    .sort(() => (exam?.randomizeQuestions ? Math.random() - 0.5 : 0));
  const existingAttempt = examAttempts.find((a) => a.examId === examId && a.studentId === user?._id);
  const canRetake = exam?.allowMultipleAttempts ?? false;

  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam ? exam.durationMinutes * 60 : 0);
  const [startedAt] = useState(() => new Date().toISOString());
  const [tabWarnings, setTabWarnings] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!exam || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [exam, timeLeft]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted) setTabWarnings((p) => p + 1);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (!exam || !user || submitted) return;
    const attempt = submitExamAttempt(examId, user._id, user.name, answers);
    setSubmitted(true);
    setResult(attempt);
    if (exam.showResultsImmediately) setResult(attempt);
  }, [exam, user, answers, submitted, examId, submitExamAttempt]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) handleSubmit();
  }, [timeLeft, submitted, handleSubmit]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!exam) return <Loader />;

  if (existingAttempt && !canRetake && !submitted) {
    return (
      <div className="px-8 py-12">
        <Card customClass="bg-white shadow max-w-md mx-auto text-center">
          <h5 className="font-bold mb-4">Already Attempted</h5>
          <p className="text-gray-600 mb-4">You have already taken this exam.</p>
          <p className="font-medium">Score: {existingAttempt.score}/{exam.totalMarks}</p>
          <p className={existingAttempt.passed ? "text-green-600" : "text-red-600"}>
            {existingAttempt.passed ? "Passed" : "Failed"}
          </p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Back to Course
          </button>
        </Card>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="px-8 py-12">
        <Card customClass="bg-white shadow max-w-md mx-auto text-center">
          <h5 className="font-bold mb-4">Exam Complete</h5>
          <div className={`flex items-center justify-center gap-2 text-2xl font-bold mb-2 ${result.passed ? "text-green-600" : "text-red-600"}`}>
            {result.passed ? <FiCheckCircle size={32} /> : <FiXCircle size={32} />}
            {result.passed ? "Passed" : "Failed"}
          </div>
          <p className="text-3xl font-bold text-indigo-600">{result.score}/{exam.totalMarks}</p>
          <p className="text-sm text-gray-600 mt-2">Passing: {exam.passingMarks}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Back to Course
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 px-8 mb-6 shadow flex flex-wrap justify-between items-center gap-4">
        <h4 className="text-2xl font-semibold">{exam.title}</h4>
        <div className="flex items-center gap-4">
          {tabWarnings > 0 && (
            <span className="text-amber-600 text-sm">Tab switch detected: {tabWarnings}x</span>
          )}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? "bg-red-100 text-red-800" : "bg-gray-100"}`}>
            <FiClock size={20} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div className="px-8 max-w-3xl mx-auto space-y-6">
        {examQuestions.map((q, idx) => (
          <Card key={q._id} customClass="bg-white shadow">
            <div className="font-medium mb-2">
              {idx + 1}. {q.questionText}
            </div>
            <div className="text-sm text-gray-500 mb-4">{q.marks} marks</div>
            {q.type === "MCQ" || q.type === "TrueFalse" ? (
              <div className="space-y-2">
                {q.options?.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q._id}
                      checked={answers[q._id] === opt.id}
                      onChange={() => setAnswers((p) => ({ ...p, [q._id]: opt.id }))}
                      className="w-4 h-4"
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[q._id] || ""}
                onChange={(e) => setAnswers((p) => ({ ...p, [q._id]: e.target.value }))}
                placeholder="Your answer"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamAttemptPage;
