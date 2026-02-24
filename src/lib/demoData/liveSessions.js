const now = new Date();
const hoursFromNow = (h) => new Date(now.getTime() + h * 3600000).toISOString();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoLiveSessions = [
  { _id: "ls1", courseId: "c1", instructorId: "u1", instructorName: "Dr. Sarah Johnson", title: "Intro to Programming - Week 1", description: "Variables and data types", scheduledAt: hoursFromNow(24), durationMinutes: 60, meetingLink: "https://meet.example.com/abc123", status: "Scheduled", organizationId: "org-1" },
  { _id: "ls2", courseId: "c2", instructorId: "u1", instructorName: "Dr. Sarah Johnson", title: "Data Structures Live", description: "Stacks and queues", scheduledAt: hoursFromNow(72), durationMinutes: 90, meetingLink: "https://meet.example.com/def456", status: "Scheduled", organizationId: "org-1" },
  { _id: "ls3", courseId: "c1", instructorId: "u1", instructorName: "Dr. Sarah Johnson", title: "Functions Workshop", description: "Completed session", scheduledAt: daysAgo(3), durationMinutes: 60, meetingLink: null, status: "Completed", recordingLink: "https://recordings.example.com/xyz", organizationId: "org-1" },
];
