export const demoCommunityPosts = [
  { _id: "cp1", courseId: "c1", authorId: "s1", authorName: "John Doe", content: "Great course! Anyone have tips for the final project?", upvotes: 12, createdAt: new Date().toISOString() },
  { _id: "cp2", courseId: "c1", authorId: "s2", authorName: "Jane Smith", content: "The algorithms section was challenging but rewarding.", upvotes: 8, createdAt: new Date().toISOString() },
];

export const demoComments = [
  { _id: "cc1", postId: "cp1", authorId: "s2", authorName: "Jane Smith", content: "Start with the basics and iterate!", upvotes: 3, createdAt: new Date().toISOString() },
];

export const demoReputation = [
  { userId: "s1", points: 450, level: "Contributor" },
  { userId: "s2", points: 320, level: "Helper" },
];

export const demoMentors = [
  { _id: "m1", name: "Alex Mentor", expertise: ["JavaScript", "React"], rating: 4.9, sessions: 120, avatar: null },
  { _id: "m2", name: "Sarah Coach", expertise: ["Data Structures", "Algorithms"], rating: 4.8, sessions: 95, avatar: null },
];

export const demoFollows = [
  { followerId: "s1", followingId: "s2" },
];
