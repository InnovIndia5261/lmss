const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoLessons = [
  { _id: "l1", courseId: "c1", title: "Welcome & Setup", content: "Get started with the course.", videoUrl: null, attachments: [], order: 1, releaseDate: daysAgo(60), isPreview: true },
  { _id: "l2", courseId: "c1", title: "Variables and Data Types", content: "Understanding variables in programming.", videoUrl: null, attachments: [], order: 2, releaseDate: daysAgo(55), isPreview: false },
  { _id: "l3", courseId: "c1", title: "Control Flow", content: "If statements and loops.", videoUrl: null, attachments: [], order: 3, releaseDate: daysAgo(50), isPreview: false },
  { _id: "l4", courseId: "c1", title: "Functions", content: "Creating and using functions.", videoUrl: null, attachments: [], order: 4, releaseDate: daysAgo(45), isPreview: false },
  { _id: "l5", courseId: "c1", title: "Arrays and Objects", content: "Working with collections.", videoUrl: null, attachments: [], order: 5, releaseDate: daysAgo(40), isPreview: false },
  { _id: "l6", courseId: "c2", title: "Arrays & Linked Lists", content: "Linear data structures.", videoUrl: null, attachments: [], order: 1, releaseDate: daysAgo(45), isPreview: true },
  { _id: "l7", courseId: "c2", title: "Stacks and Queues", content: "LIFO and FIFO structures.", videoUrl: null, attachments: [], order: 2, releaseDate: daysAgo(40), isPreview: false },
  { _id: "l8", courseId: "c2", title: "Trees and Graphs", content: "Non-linear data structures.", videoUrl: null, attachments: [], order: 3, releaseDate: daysAgo(35), isPreview: false },
  { _id: "l9", courseId: "c2", title: "Sorting Algorithms", content: "Bubble, merge, quick sort.", videoUrl: null, attachments: [], order: 4, releaseDate: daysAgo(30), isPreview: false },
  { _id: "l10", courseId: "c3", title: "HTML Basics", content: "Structure of web pages.", videoUrl: null, attachments: [], order: 1, releaseDate: daysAgo(7), isPreview: true },
];
