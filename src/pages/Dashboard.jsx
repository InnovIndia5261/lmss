import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import BookCard from "../components/BookCard";
import DashboardCard from "../components/DashboardCard";
import { FiBook, FiUsers, FiTrendingUp, FiClock, FiSearch, FiFilter, FiFileText, FiClipboard } from "react-icons/fi";
import Loader from "../components/common/Loader";
import { SkeletonDashboardCard } from "../components/common/Skeleton";
import Modal from "../components/common/modal";
import { MembersContext } from "../context/MembersContext";
import { BooksContext } from "../context/BooksContext";
import { AcademicsContext } from "../context/AcademicsContext";
import { PerformanceContext } from "../context/PerformanceContext";
import { GamificationContext } from "../context/GamificationContext";
import { LiveClassesContext } from "../context/LiveClassesContext";
import { PlagiarismContext } from "../context/PlagiarismContext";
import { useExternalLearning } from "../context/ExternalLearningContext";
import { AIContext } from "../context/AIContext";
import DropoutRiskBadge from "../features/ai/DropoutRiskBadge";
import AddEditBookModal from "../components/AddEditBookModal";
import useAuth from "../hooks/useAuth";
import { makeApiRequest } from "../lib/api";
// import { toast } from "react-toastify";
import { NotificationContext } from "../components/common/Notification";

const Dashboard = () => {
  const { toast } = useContext(NotificationContext);
  const { user } = useAuth();
  const { members } = useContext(MembersContext);
  const { books, loading: booksLoading, addBook, updateBook, addReview } = useContext(BooksContext);
  const { enrollments, assignments, submissions } = useContext(AcademicsContext);
  const { getRiskStudents } = useContext(PerformanceContext);
  const { getTotalXP, getLevelFromXP } = useContext(GamificationContext);
  const { getUpcomingSessions } = useContext(LiveClassesContext);
  const { getFlaggedReports } = useContext(PlagiarismContext);
  const { getFeaturedCourses, getPlatformById, openCourseUrl } = useExternalLearning();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [issuanceData, setIssuanceData] = useState({
    issuedTo: "",
    estimatedReturnDate: "",
  });

  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [toBeEditedBook, setToBeEditedBook] = useState(null);

  const [showAddBookModal, setshowAddBookModal] = useState(false);
  const [newBookInfo, setNewBookInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Available"
          ? book.availability
          : !book.availability;
    return matchesSearch && matchesStatus;
  });

  // Removed local fetchBooks as it is now in context

  const getDashboardData = async () => {
    setLoading(true);
    // Mock dashboard data
    setDashboardData({
      bookCount: 120,
      membersCount: 45,
      issuedBooksCount: 15,
      returnDueCount: 5
    });
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // useEffect(() => {
  //   if (books.length > 0) {
  //     toast("Dashboard loaded successfully!!!!!");
  //   }
  // }, [books]);

  const handleIssueBook = async () => {
    // Mock issue book
    const updatedBook = { ...selectedBook, availability: false, status: "Issued" };
    updateBook(updatedBook);

    setSelectedBook(null);
    setShowBookModal(false);
    toast("Book issued successfully!");
  };

  const handleEditBookClick = (book) => {
    setToBeEditedBook(book);
    setShowEditBookModal(true);
  };

  const handleEditBookSubmit = async (bookInfo) => {
    try {
      updateBook(bookInfo);
      setShowEditBookModal(false);
      setToBeEditedBook(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBookSubmit = async (bookInfo) => {
    // Mock add book
    const newBook = { ...bookInfo, _id: Math.random().toString(36).substr(2, 9), availability: true, status: "Available" };
    addBook(newBook);
    setshowAddBookModal(false);
    setNewBookInfo(null);
  };

  return (
    <div className="px-6 py-8 min-h-screen">
      <div className="mb-10">
        <h1 className="heading-1 pt-12 pb-1">
        Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here&apos;s your learning overview</p>
      </div>

      {user?.role !== "Member" && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <SkeletonDashboardCard />
              <SkeletonDashboardCard />
              <SkeletonDashboardCard />
              <SkeletonDashboardCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <DashboardCard
                title="Books"
                count={dashboardData?.bookCount}
                Icon={<FiBook size={38} color="blue" />}
              />
              <DashboardCard
                title="Members"
                count={dashboardData?.membersCount}
                Icon={<FiUsers size={38} color="green" />}
              />
              <DashboardCard
                title="Issued Books"
                count={dashboardData?.issuedBooksCount}
                Icon={<FiTrendingUp size={38} color="orange" />}
              />
              <DashboardCard
                title={"Return Due"}
                count={dashboardData?.returnDueCount}
                Icon={<FiClock size={38} color="red" />}
              />
            </div>
          )}
        </>
      )}

      {/* Courses & Assessments Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/my-learning">
          <DashboardCard
            title="Enrolled Courses"
            count={enrollments?.filter((e) => e.studentId === user?._id).length ?? 0}
            Icon={<FiBook size={38} color="indigo" />}
          />
        </Link>
        <Link to="/my-learning">
          <DashboardCard
            title="Upcoming Assignments"
            count={
              assignments?.filter((a) => {
                const due = new Date(a.dueDate);
                const submitted = submissions?.some((s) => s.assignmentId === a._id && s.studentId === user?._id);
                const enrolled = enrollments?.some((e) => e.courseId === a.courseId && e.studentId === user?._id);
                return due > new Date() && !submitted && enrolled;
              }).length ?? 0
            }
            Icon={<FiFileText size={38} color="amber" />}
          />
        </Link>
        {(user?.role === "admin" || user?.role === "Admin" || user?.role === "staff" || user?.role === "Staff") && (
          <Link to="/courses">
            <DashboardCard
              title="Pending Grading"
              count={submissions?.filter((s) => s.status === "Submitted").length ?? 0}
              Icon={<FiClipboard size={38} color="red" />}
            />
          </Link>
        )}
        <div className="p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <h5 className="label-stat mb-1">Exam Performance</h5>
          <div className="text-2xl font-bold text-indigo-600">—</div>
          <div className="text-xs text-gray-500">Summary placeholder</div>
        </div>
      </div>

      {(user?.role === "admin" || user?.role === "Admin") && getRiskStudents?.().length > 0 && (
        <div className="mb-8">
          <h5 className="font-bold mb-4">At-Risk Students</h5>
          <div className="flex flex-wrap gap-2">
            {getRiskStudents().slice(0, 5).map((p) => (
              <div key={p._id} className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl transition-colors duration-200">
                <span className="font-medium">{p.studentName}</span>
                <span className="text-sm text-red-600">({p.riskLevel})</span>
                <DropoutRiskBadge studentId={p.studentId} studentName={p.studentName} />
              </div>
            ))}
          </div>
        </div>
      )}

      {user && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <h5 className="label-stat mb-2">Your XP</h5>
            <div className="text-2xl font-semibold text-gray-900">Level {getLevelFromXP(getTotalXP(user._id))}</div>
            <div className="text-sm text-gray-600">{getTotalXP(user._id)} XP</div>
          </div>
          {getUpcomingSessions?.().length > 0 && (
            <div className="p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <h5 className="label-stat mb-2">Next Live Session</h5>
              <div className="font-medium">{getUpcomingSessions()[0]?.title}</div>
              <div className="text-sm text-gray-600">{new Date(getUpcomingSessions()[0]?.scheduledAt).toLocaleString()}</div>
            </div>
          )}
          {(user?.role === "admin" || user?.role === "Admin") && getFlaggedReports?.().length > 0 && (
            <div className="p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <h5 className="label-stat mb-2">Plagiarism Alerts</h5>
              <div className="text-2xl font-semibold text-gray-900">{getFlaggedReports().length}</div>
              <div className="text-sm text-red-700">Flagged submissions</div>
            </div>
          )}
        </div>
      )}

      {/* Explore Global Courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="heading-2">Explore Global Courses</h3>
          <Link to="/external-learning" className="text-indigo-600 hover:underline text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {getFeaturedCourses(5).map((course) => {
            const platform = getPlatformById(course.platformId);
            return (
              <div
                key={course.id}
                className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{platform?.name}</p>
                    <span className="badge-featured inline-block mt-2">
                      {course.category}
                    </span>
                  </div>
                  <button
                    onClick={() => openCourseUrl(course, platform, user?._id)}
                    className="btn-primary mt-3 w-full text-sm font-medium"
                  >
                    Open Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="mb-10 p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm">
        <h3 className="heading-2 mb-3">Library News & Announcements</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>The library will be closed on Friday for maintenance.</li>
          <li>New collection of Science Fiction books arriving next week!</li>
          <li>Join our book club meeting this Saturday at 10 AM.</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="heading-2">Books ({filteredBooks.length})</h2>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:w-40">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-colors duration-150"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
          </div>

          <button
            onClick={() => setshowAddBookModal(true)}
            className="btn-success p-2 px-4 whitespace-nowrap"
          >
            Add Book
          </button>
        </div>
      </div>
      {booksLoading ? (
        <div className="py-6">
          <Loader fullscreen={false} />
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {filteredBooks.map((book) => {
            return (
              <BookCard
                key={book._id}
                book={book}
                handleBookClick={() => {
                  setShowBookModal(true);
                  setSelectedBook(book);
                  setIsIssuing(false);
                }}
                handleEditBookClick={handleEditBookClick}
              />
            );
          })}
        </div>
      )}

      {/* Task: make an Issue book component */}
      <Modal
        open={showBookModal}
        onClose={() => {
          setShowBookModal(false);
          setSelectedBook(null);
          setIssuanceData({});
          // Find the latest version of the book from context to ensure reviews are up to date
          const currentBook = books.find(b => b._id === selectedBook?._id) || selectedBook;
          setSelectedBook(currentBook);
        }}
        title={isIssuing ? "Issue Book" : "Book Details"}
      >
        {!isIssuing ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-xl font-bold mb-2">{books.find(b => b._id === selectedBook?._id)?.title}</h3>
              <p className="text-gray-600 mb-1"><strong>Author:</strong> {selectedBook?.author}</p>
              <p className="text-gray-600 mb-1"><strong>Description:</strong> {selectedBook?.description || "No description available."}</p>
              <p className="text-gray-600 mb-1"><strong>Status:</strong> <span className={selectedBook?.availability ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{selectedBook?.availability ? "Available" : "Issued"}</span></p>
            </div>

            {/* Reviews Section inside Modal */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-bold mb-2">Reviews</h4>
              <div className="max-h-32 overflow-y-auto mb-4 space-y-2">
                {selectedBook?.reviews && selectedBook.reviews.length > 0 ? (
                  selectedBook.reviews.map((rev, index) => (
                    <div key={index} className="bg-white p-2 rounded shadow-sm text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">{rev.user}</span>
                        <span className="text-yellow-500">{"★".repeat(rev.rating)}</span>
                      </div>
                      <p className="text-gray-600">{rev.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">No reviews yet.</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write a review..."
                  className="flex-1 border rounded p-2 text-sm"
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border rounded p-2 text-sm"
                >
                  <option value="5">5 ★</option>
                  <option value="4">4 ★</option>
                  <option value="3">3 ★</option>
                  <option value="2">2 ★</option>
                  <option value="1">1 ★</option>
                </select>
                <button
                  onClick={() => {
                    if (reviewText.trim()) {
                      addReview(selectedBook._id, { user: user.name, text: reviewText, rating });
                      setReviewText("");
                      // Update selectedBook locally to reflect immediate change if needed OR just rely on context update re-render
                      // Since selectedBook is a copy, we might need to update it or rely on a find
                      // Actually, 'selectedBook' state is static once set. We should probably find the book from 'books' to display reviews real-time.
                    }
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              {selectedBook?.availability && (
                <button
                  onClick={() => setIsIssuing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Issue Book
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="p-2 bg-green-100 border border-green-300 rounded-lg mb-4">
              <h5 className="font-semibold">Issuing: {selectedBook?.title}</h5>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold">Select Member</h5>
              <div className="flex flex-col gap-2">
                <select
                  value={issuanceData.issuedTo}
                  onChange={(e) => {
                    setIssuanceData({
                      ...issuanceData,
                      issuedTo: e.target.value,
                    });
                  }}
                  className="w-full p-2 rounded-lg border focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Member</option>
                  {members?.map((member) => {
                    return (
                      <option key={member?._id} value={member?._id}>
                        {member?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setIsIssuing(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={handleIssueBook}
                  disabled={!issuanceData.issuedTo}
                  className={`${issuanceData.issuedTo
                    ? "bg-green-500 text-white hover:bg-green-400"
                    : "bg-gray-200 text-gray-400"
                    } p-2 px-4 rounded-lg cursor-pointer`}
                >
                  Confirm Issue
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <AddEditBookModal
        toBeEditedBook={toBeEditedBook}
        open={showEditBookModal}
        onClose={() => {
          setShowEditBookModal(false);
          setToBeEditedBook(null);
        }}
        onSubmit={handleEditBookSubmit}
        modalTitle={"Edit Book"}
      />
      <AddEditBookModal
        toBeEditedBook={newBookInfo}
        open={showAddBookModal}
        onClose={() => {
          setNewBookInfo(null);
          setshowAddBookModal(false);
        }}
        onSubmit={handleAddBookSubmit}
        modalTitle={"Add Book"}
      />
    </div>
  );
};

export default Dashboard;
