import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { makeApiRequest } from "@/lib/api";
import {
  demoCourses,
  demoLessons,
  demoAssignments,
  demoSubmissions,
  demoExams,
  demoQuestions,
  demoEnrollments,
  demoLessonCompletions,
  demoExamAttempts,
} from "@/lib/demoData";
import { calcCourseProgress } from "@/shared/utils/progress";

const STORAGE_KEY = "lms_academics";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) {
      return {
        courses: demoCourses,
        lessons: demoLessons,
        assignments: demoAssignments,
        submissions: demoSubmissions,
        exams: demoExams,
        questions: demoQuestions,
        enrollments: demoEnrollments,
        lessonCompletions: demoLessonCompletions,
        examAttempts: demoExamAttempts,
      };
    }
    return {
      courses: [],
      lessons: [],
      assignments: [],
      submissions: [],
      exams: [],
      questions: [],
      enrollments: [],
      lessonCompletions: [],
      examAttempts: [],
    };
  } catch {
    return DEMO_MODE
      ? {
          courses: demoCourses,
          lessons: demoLessons,
          assignments: demoAssignments,
          submissions: demoSubmissions,
          exams: demoExams,
          questions: demoQuestions,
          enrollments: demoEnrollments,
          lessonCompletions: demoLessonCompletions,
          examAttempts: demoExamAttempts,
        }
      : { courses: [], lessons: [], assignments: [], submissions: [], exams: [], questions: [], enrollments: [], lessonCompletions: [], examAttempts: [] };
  }
};

let store = getStored();

const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const AcademicsContext = createContext();

export const AcademicsProvider = ({ children }) => {
  const [courses, setCourses] = useState(store.courses);
  const [lessons, setLessons] = useState(store.lessons);
  const [assignments, setAssignments] = useState(store.assignments);
  const [submissions, setSubmissions] = useState(store.submissions);
  const [exams, setExams] = useState(store.exams);
  const [questions, setQuestions] = useState(store.questions);
  const [enrollments, setEnrollments] = useState(store.enrollments);
  const [lessonCompletions, setLessonCompletions] = useState(store.lessonCompletions);
  const [examAttempts, setExamAttempts] = useState(store.examAttempts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setCourses(s.courses);
    setLessons(s.lessons);
    setAssignments(s.assignments);
    setSubmissions(s.submissions);
    setExams(s.exams);
    setQuestions(s.questions);
    setEnrollments(s.enrollments);
    setLessonCompletions(s.lessonCompletions);
    setExamAttempts(s.examAttempts);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      store = getStored();
      syncFromStore();
    }
  }, []);

  useEffect(() => {
    const handleReset = () => {
      store = getStored();
      syncFromStore();
    };
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const updateStore = (key, data) => {
    store[key] = data;
    save();
  };

  // Courses CRUD
  const addCourse = useCallback(
    async (course) => {
      setLoading(true);
      setError(null);
      if (DEMO_MODE) {
        const newCourse = {
          ...course,
          _id: `c_${Date.now()}`,
          organizationId: course.organizationId || ORG_ID,
          enrolledCount: 0,
          completionRate: 0,
          createdAt: new Date().toISOString(),
        };
        const next = [newCourse, ...courses];
        setCourses(next);
        updateStore("courses", next);
        setLoading(false);
        return newCourse;
      }
      const { response, error: err } = await makeApiRequest({
        endpoint: "/courses",
        method: "POST",
        body: { ...course, organizationId: ORG_ID },
      });
      if (err) {
        setError(err);
        setLoading(false);
        return null;
      }
      if (response?.data) {
        setCourses((p) => [response.data, ...p]);
        setLoading(false);
        return response.data;
      }
      setLoading(false);
      return null;
    },
    [courses]
  );

  const updateCourse = useCallback(
    async (course) => {
      setLoading(true);
      setError(null);
      if (DEMO_MODE) {
        const next = courses.map((c) => (c._id === course._id ? { ...c, ...course } : c));
        setCourses(next);
        updateStore("courses", next);
        setLoading(false);
        return course;
      }
      const { response, error: err } = await makeApiRequest({
        endpoint: `/courses/${course._id}`,
        method: "PUT",
        body: course,
      });
      if (err) {
        setError(err);
        setLoading(false);
        return null;
      }
      if (response?.data) {
        setCourses((p) => p.map((c) => (c._id === course._id ? response.data : c)));
        setLoading(false);
        return response.data;
      }
      setLoading(false);
      return null;
    },
    [courses]
  );

  const deleteCourse = useCallback(
    async (id) => {
      setLoading(true);
      if (DEMO_MODE) {
        setCourses((p) => p.filter((c) => c._id !== id));
        updateStore("courses", courses.filter((c) => c._id !== id));
        setLessons((p) => p.filter((l) => l.courseId !== id));
        updateStore("lessons", lessons.filter((l) => l.courseId !== id));
        setAssignments((p) => p.filter((a) => a.courseId !== id));
        updateStore("assignments", assignments.filter((a) => a.courseId !== id));
        setExams((p) => p.filter((e) => e.courseId !== id));
        updateStore("exams", exams.filter((e) => e.courseId !== id));
        setEnrollments((p) => p.filter((e) => e.courseId !== id));
        updateStore("enrollments", enrollments.filter((e) => e.courseId !== id));
        setLoading(false);
        return true;
      }
      const { error: err } = await makeApiRequest({ endpoint: `/courses/${id}`, method: "DELETE" });
      if (err) {
        setError(err);
        setLoading(false);
        return false;
      }
      setCourses((p) => p.filter((c) => c._id !== id));
      setLoading(false);
      return true;
    },
    [courses, lessons, assignments, exams, enrollments]
  );

  const enrollInCourse = useCallback(
    async (courseId, studentId, studentName) => {
      if (DEMO_MODE) {
        const exists = enrollments.some((e) => e.courseId === courseId && e.studentId === studentId);
        if (exists) return null;
        const newEnrollment = {
          _id: `en_${Date.now()}`,
          courseId,
          studentId,
          studentName,
          enrolledAt: new Date().toISOString(),
          progressPercent: 0,
        };
        const next = [...enrollments, newEnrollment];
        setEnrollments(next);
        updateStore("enrollments", next);
        const course = courses.find((c) => c._id === courseId);
        if (course) {
          const nextCourses = courses.map((c) =>
            c._id === courseId ? { ...c, enrolledCount: (c.enrolledCount || 0) + 1 } : c
          );
          setCourses(nextCourses);
          updateStore("courses", nextCourses);
        }
        return newEnrollment;
      }
      const { response } = await makeApiRequest({
        endpoint: "/enrollments",
        method: "POST",
        body: { courseId, studentId, studentName, organizationId: ORG_ID },
      });
      if (response?.data) {
        setEnrollments((p) => [...p, response.data]);
        return response.data;
      }
      return null;
    },
    [enrollments, courses]
  );

  // Lessons
  const addLesson = useCallback(
    (lesson) => {
      const newLesson = {
        ...lesson,
        _id: `l_${Date.now()}`,
        courseId: lesson.courseId,
        order: lesson.order ?? lessons.filter((l) => l.courseId === lesson.courseId).length + 1,
        releaseDate: lesson.releaseDate || new Date().toISOString(),
        isPreview: lesson.isPreview ?? false,
      };
      const next = [...lessons, newLesson];
      setLessons(next);
      updateStore("lessons", next);
      return newLesson;
    },
    [lessons]
  );

  const updateLesson = useCallback(
    (lesson) => {
      const next = lessons.map((l) => (l._id === lesson._id ? { ...l, ...lesson } : l));
      setLessons(next);
      updateStore("lessons", next);
      return lesson;
    },
    [lessons]
  );

  const reorderLessons = useCallback(
    (courseId, orderedIds) => {
      const courseLessons = lessons.filter((l) => l.courseId === courseId);
      const orderMap = {};
      orderedIds.forEach((id, i) => (orderMap[id] = i + 1));
      const next = lessons.map((l) =>
        l.courseId === courseId && orderMap[l._id] !== undefined
          ? { ...l, order: orderMap[l._id] }
          : l
      );
      next.sort((a, b) => {
        if (a.courseId !== b.courseId) return 0;
        return (a.order || 0) - (b.order || 0);
      });
      setLessons(next);
      updateStore("lessons", next);
    },
    [lessons]
  );

  const markLessonComplete = useCallback(
    (lessonId, studentId) => {
      const exists = lessonCompletions.some((c) => c.lessonId === lessonId && c.studentId === studentId);
      if (exists) return;
      const newCompletion = {
        _id: `lc_${Date.now()}`,
        lessonId,
        studentId,
        completedAt: new Date().toISOString(),
      };
      const nextCompletions = [...lessonCompletions, newCompletion];
      setLessonCompletions(nextCompletions);
      updateStore("lessonCompletions", nextCompletions);
      const lesson = lessons.find((l) => l._id === lessonId);
      if (lesson) {
        const courseLessons = lessons.filter((l) => l.courseId === lesson.courseId);
        const completed = nextCompletions.filter(
          (c) => c.studentId === studentId && courseLessons.some((l) => l._id === c.lessonId)
        ).length;
        const progressPercent = Math.round((completed / courseLessons.length) * 100);
        const nextEnrollments = enrollments.map((e) =>
          e.courseId === lesson.courseId && e.studentId === studentId ? { ...e, progressPercent } : e
        );
        setEnrollments(nextEnrollments);
        updateStore("enrollments", nextEnrollments);
      }
    },
    [lessonCompletions, lessons, enrollments]
  );

  // Assignments & Submissions
  const addAssignment = useCallback(
    (assignment) => {
      const newAssignment = {
        ...assignment,
        _id: `a_${Date.now()}`,
        organizationId: assignment.organizationId || ORG_ID,
        courseId: assignment.courseId,
        createdAt: new Date().toISOString(),
      };
      const next = [...assignments, newAssignment];
      setAssignments(next);
      updateStore("assignments", next);
      return newAssignment;
    },
    [assignments]
  );

  const updateAssignment = useCallback(
    (assignment) => {
      const next = assignments.map((a) => (a._id === assignment._id ? { ...a, ...assignment } : a));
      setAssignments(next);
      updateStore("assignments", next);
      return assignment;
    },
    [assignments]
  );

  const submitAssignment = useCallback(
    (assignmentId, studentId, studentName, { fileUrl, textAnswer }) => {
      const assignment = assignments.find((a) => a._id === assignmentId);
      const isLate = assignment && new Date() > new Date(assignment.dueDate);
      const newSubmission = {
        _id: `s_${Date.now()}`,
        assignmentId,
        studentId,
        studentName,
        fileUrl: fileUrl || null,
        textAnswer: textAnswer || null,
        submittedAt: new Date().toISOString(),
        marks: null,
        feedback: null,
        gradedBy: null,
        status: "Submitted",
        isLate: !!isLate,
      };
      const next = [...submissions, newSubmission];
      setSubmissions(next);
      updateStore("submissions", next);
      return newSubmission;
    },
    [assignments, submissions]
  );

  const gradeSubmission = useCallback(
    (submissionId, marks, feedback, gradedBy) => {
      const next = submissions.map((s) =>
        s._id === submissionId ? { ...s, marks, feedback, gradedBy, status: "Graded" } : s
      );
      setSubmissions(next);
      updateStore("submissions", next);
    },
    [submissions]
  );

  // Exams & Attempts
  const addExam = useCallback(
    (exam) => {
      const newExam = {
        ...exam,
        _id: `e_${Date.now()}`,
        organizationId: exam.organizationId || ORG_ID,
        courseId: exam.courseId,
        createdAt: new Date().toISOString(),
      };
      const next = [...exams, newExam];
      setExams(next);
      updateStore("exams", next);
      return newExam;
    },
    [exams]
  );

  const addQuestion = useCallback(
    (question) => {
      const newQuestion = {
        ...question,
        _id: `q_${Date.now()}`,
        examId: question.examId,
      };
      const next = [...questions, newQuestion];
      setQuestions(next);
      updateStore("questions", next);
      return newQuestion;
    },
    [questions]
  );

  const submitExamAttempt = useCallback(
    (examId, studentId, studentName, answers) => {
      const exam = exams.find((e) => e._id === examId);
      const examQuestions = questions.filter((q) => q.examId === examId);
      let score = 0;
      examQuestions.forEach((q) => {
        const ans = answers[q._id];
        if (q.type === "MCQ" || q.type === "TrueFalse") {
          if (ans === q.correctAnswer) score += q.marks || 10;
        } else if (q.type === "ShortAnswer" && ans) {
          const correct = String(q.correctAnswer).toLowerCase().trim();
          const given = String(ans).toLowerCase().trim();
          if (correct === given || correct.includes(given) || given.includes(correct)) score += q.marks || 10;
        }
      });
      const totalMarks = exam?.totalMarks || 100;
      const passed = score >= (exam?.passingMarks ?? totalMarks * 0.6);
      const newAttempt = {
        _id: `ea_${Date.now()}`,
        examId,
        studentId,
        studentName,
        answers,
        score,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: "Completed",
        passed,
      };
      const next = [...examAttempts, newAttempt];
      setExamAttempts(next);
      updateStore("examAttempts", next);
      return newAttempt;
    },
    [exams, questions, examAttempts]
  );

  const getCourseProgress = useCallback(
    (courseId, studentId) => {
      return calcCourseProgress(courseId, lessons, lessonCompletions, studentId);
    },
    [lessons, lessonCompletions]
  );

  const value = {
    courses,
    lessons,
    assignments,
    submissions,
    exams,
    questions,
    enrollments,
    lessonCompletions,
    examAttempts,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    addLesson,
    updateLesson,
    reorderLessons,
    markLessonComplete,
    addAssignment,
    updateAssignment,
    submitAssignment,
    gradeSubmission,
    addExam,
    addQuestion,
    submitExamAttempt,
    getCourseProgress,
  };

  return <AcademicsContext.Provider value={value}>{children}</AcademicsContext.Provider>;
};
