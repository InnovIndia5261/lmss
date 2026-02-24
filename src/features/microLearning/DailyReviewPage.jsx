import React, { useContext, useState } from "react";
import { MicroLearningContext } from "@/context/MicroLearningContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiChevronDown, FiRotateCcw } from "react-icons/fi";

const DailyReviewPage = () => {
  const { flashcards, getDueToday, markReview } = useContext(MicroLearningContext);
  const { user } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const dueCards = user ? getDueToday(user._id) : [];
  const current = dueCards[currentIdx];

  const handleResult = (result) => {
    if (current && user) markReview(current._id, user._id, result);
    setShowAnswer(false);
    setCurrentIdx((p) => Math.min(p + 1, dueCards.length - 1));
  };

  if (dueCards.length === 0) {
    return (
      <div>
        <div className="p-4 px-8 mb-8 shadow">
          <h4 className="text-3xl font-semibold">Daily Review</h4>
        </div>
        <div className="px-8">
          <Card customClass="bg-green-50 border border-green-200 text-center py-12">
            <p className="text-lg font-medium text-green-800">All caught up!</p>
            <p className="text-gray-600 mt-2">No flashcards due today.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow flex justify-between items-center">
        <h4 className="text-3xl font-semibold">Daily Review</h4>
        <span className="text-gray-600">{currentIdx + 1} / {dueCards.length}</span>
      </div>
      <div className="px-8 max-w-2xl mx-auto">
        <Card customClass="bg-white shadow">
          <div className="text-lg font-medium mb-4">{current?.question}</div>
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="flex items-center gap-2 text-indigo-600 hover:underline"
            >
              <FiChevronDown size={20} /> Show Answer
            </button>
          ) : (
            <>
              <div className="p-4 bg-gray-50 rounded-lg mb-6">{current?.answer}</div>
              <div className="flex flex-wrap gap-2">
                {["Again", "Hard", "Good", "Easy"].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleResult(r)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      r === "Again" ? "bg-red-100 text-red-800" :
                      r === "Hard" ? "bg-amber-100 text-amber-800" :
                      r === "Good" ? "bg-green-100 text-green-800" :
                      "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DailyReviewPage;
