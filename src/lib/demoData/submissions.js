const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoSubmissions = [
  { _id: "s1", assignmentId: "a1", studentId: "s1", studentName: "John Doe", fileUrl: null, textAnswer: "print('Hello World')", submittedAt: daysAgo(3), marks: 95, feedback: "Great work!", gradedBy: "u1", status: "Graded", isLate: false },
  { _id: "s2", assignmentId: "a1", studentId: "s2", studentName: "Jane Smith", fileUrl: null, textAnswer: "console.log('Hello World')", submittedAt: daysAgo(1), marks: null, feedback: null, gradedBy: null, status: "Submitted", isLate: false },
  { _id: "s3", assignmentId: "a2", studentId: "s1", studentName: "John Doe", fileUrl: null, textAnswer: "Completed variables exercise", submittedAt: daysAgo(1), marks: 88, feedback: "Good.", gradedBy: "u1", status: "Graded", isLate: false },
  { _id: "s4", assignmentId: "a2", studentId: "s2", studentName: "Jane Smith", fileUrl: null, textAnswer: null, submittedAt: null, marks: null, feedback: null, gradedBy: null, status: "Pending", isLate: false },
  { _id: "s5", assignmentId: "a2", studentId: "s3", studentName: "Emily Davis", fileUrl: null, textAnswer: "Late submission", submittedAt: daysAgo(0), marks: 72, feedback: "Late penalty applied.", gradedBy: "u1", status: "Graded", isLate: true },
  { _id: "s6", assignmentId: "a4", studentId: "s1", studentName: "John Doe", fileUrl: null, textAnswer: null, submittedAt: null, marks: null, feedback: null, gradedBy: null, status: "Pending", isLate: false },
  { _id: "s7", assignmentId: "a4", studentId: "s2", studentName: "Jane Smith", fileUrl: null, textAnswer: "Stack implementation", submittedAt: daysAgo(2), marks: null, feedback: null, gradedBy: null, status: "Submitted", isLate: false },
  { _id: "s8", assignmentId: "a5", studentId: "s1", studentName: "John Doe", fileUrl: null, textAnswer: "BST code", submittedAt: daysAgo(3), marks: 90, feedback: "Well done.", gradedBy: "u1", status: "Graded", isLate: false },
  { _id: "s9", assignmentId: "a5", studentId: "s2", studentName: "Jane Smith", fileUrl: null, textAnswer: null, submittedAt: null, marks: null, feedback: null, gradedBy: null, status: "Pending", isLate: false },
  { _id: "s10", assignmentId: "a1", studentId: "mock-user-123", studentName: "Explorer User", fileUrl: null, textAnswer: "My first program", submittedAt: daysAgo(5), marks: null, feedback: null, gradedBy: null, status: "Submitted", isLate: false },
];
