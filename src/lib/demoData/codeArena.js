const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 86400000).toISOString();

export const demoCodingProblems = [
  { _id: "cp1", organizationId: "org-1", title: "Two Sum", description: "Find two numbers that add up to target", difficulty: "Easy", inputFormat: "nums[], target", outputFormat: "indices[]", sampleInput: "[2,7,11,15], 9", sampleOutput: "[0,1]", constraints: "One solution exists", testCases: [], timeLimitMs: 1000, memoryLimitMB: 128 },
  { _id: "cp2", organizationId: "org-1", title: "Reverse String", description: "Reverse a string in-place", difficulty: "Easy", inputFormat: "s[]", outputFormat: "void", sampleInput: "hello", sampleOutput: "olleh", constraints: "O(1) space", testCases: [], timeLimitMs: 500, memoryLimitMB: 64 },
  { _id: "cp3", organizationId: "org-1", title: "Binary Search", description: "Find target in sorted array", difficulty: "Medium", inputFormat: "nums[], target", outputFormat: "index", sampleInput: "[-1,0,3,5,9], 9", sampleOutput: "4", constraints: "O(log n)", testCases: [], timeLimitMs: 500, memoryLimitMB: 64 },
];

export const demoCodeSubmissions = [
  { _id: "cs1", problemId: "cp1", studentId: "s1", language: "javascript", code: "function twoSum(a,t){for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]+a[j]===t)return[i,j]}", status: "Accepted", score: 100, executionTime: 45, submittedAt: now.toISOString() },
  { _id: "cs2", problemId: "cp2", studentId: "s1", language: "javascript", code: "function reverse(s){return s.split('').reverse().join('')}", status: "WrongAnswer", score: 0, executionTime: null, submittedAt: now.toISOString() },
];

export const demoContests = [
  { _id: "ct1", organizationId: "org-1", title: "Weekly Challenge", startTime: daysFromNow(1), endTime: daysFromNow(2), problems: ["cp1", "cp2"], leaderboardJSON: null },
];
