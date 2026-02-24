import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoCertificates } from "@/lib/demoData";
import { generateCertificateNumber, generateVerificationCode } from "@/shared/utils/certificate";

const STORAGE_KEY = "lms_certificates";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { certificates: demoCertificates };
    return { certificates: [] };
  } catch {
    return DEMO_MODE ? { certificates: demoCertificates } : { certificates: [] };
  }
};

export const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [certificates, setCertificates] = useState(getStored().certificates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    setCertificates(getStored().certificates);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const getCertificatesByStudent = useCallback(
    (studentId) => certificates.filter((c) => c.studentId === studentId),
    [certificates]
  );

  const verifyCertificate = useCallback(
    (code) => certificates.find((c) => c.verificationCode === code),
    [certificates]
  );

  const issueCertificate = useCallback((studentId, studentName, courseId, courseTitle) => {
    const newCert = {
      _id: `cert_${Date.now()}`,
      studentId,
      studentName,
      courseId,
      courseTitle,
      certificateNumber: generateCertificateNumber(),
      issuedAt: new Date().toISOString(),
      verificationCode: generateVerificationCode(),
      organizationId: ORG_ID,
    };
    const next = [...certificates, newCert];
    setCertificates(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ certificates: next }));
    return newCert;
  }, [certificates]);

  const value = {
    certificates,
    loading,
    error,
    getCertificatesByStudent,
    verifyCertificate,
    issueCertificate,
  };

  return <CertificateContext.Provider value={value}>{children}</CertificateContext.Provider>;
};
