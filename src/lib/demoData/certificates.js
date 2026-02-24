const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoCertificates = [
  { _id: "cert1", studentId: "s2", studentName: "Jane Smith", courseId: "c1", courseTitle: "Introduction to Programming", certificateNumber: "CERT-ABC123-XY", issuedAt: daysAgo(5), verificationCode: "V1A2B3C4", organizationId: "org-1" },
  { _id: "cert2", studentId: "s2", studentName: "Jane Smith", courseId: "c2", courseTitle: "Data Structures & Algorithms", certificateNumber: "CERT-DEF456-ZW", issuedAt: daysAgo(2), verificationCode: "V5D6E7F8", organizationId: "org-1" },
  { _id: "cert3", studentId: "s1", studentName: "John Doe", courseId: "c1", courseTitle: "Introduction to Programming", certificateNumber: "CERT-GHI789-QR", issuedAt: daysAgo(1), verificationCode: "V9G0H1I2", organizationId: "org-1" },
  { _id: "cert4", studentId: "s1", studentName: "John Doe", courseId: "c2", courseTitle: "Data Structures & Algorithms", certificateNumber: "CERT-JKL012-ST", issuedAt: daysAgo(0), verificationCode: "V3J4K5L6", organizationId: "org-1" },
  { _id: "cert5", studentId: "s3", studentName: "Emily Davis", courseId: "c1", courseTitle: "Introduction to Programming", certificateNumber: "CERT-MNO345-UV", issuedAt: daysAgo(10), verificationCode: "V7M8N9O0", organizationId: "org-1" },
];
