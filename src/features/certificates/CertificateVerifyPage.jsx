import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { CertificateContext } from "@/context/CertificateContext";
import Card from "@/components/common/Card";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const CertificateVerifyPage = () => {
  const { code: urlCode } = useParams();
  const { verifyCertificate } = useContext(CertificateContext);
  const [manualCode, setManualCode] = useState("");
  const codeToVerify = urlCode || manualCode;
  const cert = codeToVerify ? verifyCertificate(codeToVerify) : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card customClass="bg-white shadow max-w-md w-full">
        <h4 className="text-2xl font-bold mb-6 text-center">Certificate Verification</h4>
        {!codeToVerify && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter verification code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setManualCode(manualCode)}
              className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Verify
            </button>
          </div>
        )}
        {cert ? (
          <div className="text-center space-y-4">
            <FiCheckCircle className="text-green-500 mx-auto" size={48} />
            <div className="font-bold text-green-600">Certificate Verified</div>
            <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2">
              <div><span className="text-gray-600">Student:</span> {cert.studentName}</div>
              <div><span className="text-gray-600">Course:</span> {cert.courseTitle}</div>
              <div><span className="text-gray-600">Certificate #:</span> {cert.certificateNumber}</div>
              <div><span className="text-gray-600">Issued:</span> {new Date(cert.issuedAt).toLocaleDateString()}</div>
            </div>
          </div>
        ) : codeToVerify && (
          <div className="text-center">
            <FiXCircle className="text-red-500 mx-auto" size={48} />
            <div className="font-bold text-red-600 mt-2">Certificate not found</div>
            <p className="text-sm text-gray-600 mt-2">Please check the verification code.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CertificateVerifyPage;
