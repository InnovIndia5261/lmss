const now = new Date().toISOString();

export const demoPlagiarismReports = [
  { _id: "pr1", submissionId: "s2", assignmentId: "a1", similarityScore: 45, matchedSubmissionIds: [], flagged: false, generatedAt: now },
  { _id: "pr2", submissionId: "s5", assignmentId: "a2", similarityScore: 78, matchedSubmissionIds: ["s3"], flagged: true, generatedAt: now },
  { _id: "pr3", submissionId: "s7", assignmentId: "a4", similarityScore: 32, matchedSubmissionIds: [], flagged: false, generatedAt: now },
  { _id: "pr4", submissionId: "s10", assignmentId: "a1", similarityScore: 82, matchedSubmissionIds: ["s1", "s2"], flagged: true, generatedAt: now },
  { _id: "pr5", submissionId: "s3", assignmentId: "a2", similarityScore: 55, matchedSubmissionIds: [], flagged: false, generatedAt: now },
  { _id: "pr6", submissionId: "s1", assignmentId: "a1", similarityScore: 25, matchedSubmissionIds: [], flagged: false, generatedAt: now },
  { _id: "pr7", submissionId: "s8", assignmentId: "a5", similarityScore: 91, matchedSubmissionIds: ["s1"], flagged: true, generatedAt: now },
  { _id: "pr8", submissionId: "s4", assignmentId: "a2", similarityScore: 0, matchedSubmissionIds: [], flagged: false, generatedAt: now },
  { _id: "pr9", submissionId: "s6", assignmentId: "a4", similarityScore: 0, matchedSubmissionIds: [], flagged: false, generatedAt: now },
  { _id: "pr10", submissionId: "s9", assignmentId: "a5", similarityScore: 68, matchedSubmissionIds: [], flagged: false, generatedAt: now },
];
