import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router";
import { AcademicsContext } from "@/context/AcademicsContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import AIStudyCopilot from "@/features/ai/AIStudyCopilot";
import { FiBook, FiUsers, FiCheckCircle, FiFileText, FiClipboard, FiLock, FiPlay } from "react-icons/fi";
import Loader from "@/components/common/Loader";

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, lessons, assignments, exams, enrollments, lessonCompletions, updateCourse, enrollInCourse, markLessonComplete, getCourseProgress } = useContext(AcademicsContext);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLesson, setSelectedLesson] = useState(null);

  const course = courses.find((c) => c._id === id);
  const courseLessons = lessons.filter((l) => l.courseId === id).sort((a, b) => (a.order || 0) - (b.order || 0));
  const courseAssignments = assignments.filter((a) => a.courseId === id);
  const courseExams = exams.filter((e) => e.courseId === id);
  const myEnrollment = enrollments.find((e) => e.courseId === id && e.studentId === user?._id);
  const progress = user ? getCourseProgress(id, user._id) : 0;
  const canManage = user?.role === "admin" || user?.role === "Admin" || user?.role === "staff" || user?.role === "Staff";

  const handlePublish = () => {
    if (course) updateCourse({ ...course, status: "Published" });
  };
  const handleArchive = () => {
    if (course) updateCourse({ ...course, status: "Archived" });
  };
  const handleEnroll = () => {
    if (course && user) enrollInCourse(id, user._id, user.name);
  };

  const isLessonComplete = (lessonId) =>
    lessonCompletions.some((c) => c.lessonId === lessonId && c.studentId === user?._id);
  const isLessonLocked = (lesson, idx) => {
    if (lesson.isPreview) return false;
    if (idx === 0) return false;
    const prev = courseLessons[idx - 1];
    return !isLessonComplete(prev._id);
  };

  if (!course) return <Loader />;

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBook },
    { id: "lessons", label: "Lessons", icon: FiPlay },
    { id: "assignments", label: "Assignments", icon: FiFileText },
    { id: "exams", label: "Exams", icon: FiClipboard },
    ...(canManage ? [{ id: "students", label: "Students", icon: FiUsers }] : []),
  ];

  return (
    <div>
      <div className="p-4 px-8 mb-6 shadow">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h4 className="text-3xl font-semibold">{course.title}</h4>
            <p className="text-gray-600 mt-1">{course.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">{course.level}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{course.category}</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{course.status}</span>
            </div>
          </div>
          {canManage && course.status !== "Archived" && (
            <div className="flex gap-2">
              {course.status === "Draft" && (
                <button onClick={handlePublish} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Publish
                </button>
              )}
              <button onClick={handleArchive} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 -mb-px ${
                    activeTab === tab.id ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <Card customClass="bg-white shadow">
                <h5 className="font-bold mb-4">Course Overview</h5>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{courseLessons.length}</div>
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{courseAssignments.length}</div>
                    <div className="text-sm text-gray-600">Assignments</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{courseExams.length}</div>
                    <div className="text-sm text-gray-600">Exams</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{course.enrolledCount ?? 0}</div>
                    <div className="text-sm text-gray-600">Enrolled</div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "lessons" && (
              <Card customClass="bg-white shadow">
                <h5 className="font-bold mb-4">Lessons</h5>
                <div className="space-y-2">
                  {courseLessons.map((lesson, idx) => {
                    const completed = isLessonComplete(lesson._id);
                    const locked = isLessonLocked(lesson, idx);
                    return (
                      <div
                        key={lesson._id}
                        onClick={() => !locked && setSelectedLesson(lesson)}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${
                          locked ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        {completed ? (
                          <FiCheckCircle className="text-green-500 flex-shrink-0" size={24} />
                        ) : locked ? (
                          <FiLock className="text-gray-400 flex-shrink-0" size={24} />
                        ) : (
                          <FiPlay className="text-indigo-500 flex-shrink-0" size={24} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-sm text-gray-500">
                            {lesson.isPreview && "Preview • "}
                            Order: {lesson.order}
                          </div>
                        </div>
                        {!locked && user && !completed && (
                          <button
                            onClick={() => markLessonComplete(lesson._id, user._id)}
                            className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {activeTab === "assignments" && (
              <Card customClass="bg-white shadow">
                <h5 className="font-bold mb-4">Assignments</h5>
                <div className="space-y-2">
                  {courseAssignments.map((a) => (
                    <Link
                      key={a._id}
                      to={`/courses/${id}/assignments/${a._id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <div className="font-medium">{a.title}</div>
                      <div className="text-sm text-gray-500">
                        Due: {new Date(a.dueDate).toLocaleDateString()} • {a.maxMarks} marks
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "exams" && (
              <Card customClass="bg-white shadow">
                <h5 className="font-bold mb-4">Exams</h5>
                <div className="space-y-2">
                  {courseExams.map((e) => (
                    <Link
                      key={e._id}
                      to={`/courses/${id}/exams/${e._id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <div className="font-medium">{e.title}</div>
                      <div className="text-sm text-gray-500">
                        {e.durationMinutes} min • {e.totalMarks} marks • Pass: {e.passingMarks}
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "students" && canManage && (
              <Card customClass="bg-white shadow">
                <h5 className="font-bold mb-4">Enrolled Students</h5>
                <div className="space-y-2">
                  {enrollments.filter((e) => e.courseId === id).map((e) => (
                    <div key={e._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{e.studentName}</span>
                      <span className="text-sm text-gray-600">{e.progressPercent}% progress</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card customClass="bg-white shadow sticky top-4">
              <h5 className="font-bold mb-4">Course Progress</h5>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mb-4">{progress}% complete</div>
              {!myEnrollment && course.status === "Published" && user && (
                <button
                  onClick={handleEnroll}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Enroll Now
                </button>
              )}
              {myEnrollment && (
                <div className="text-sm text-green-600 font-medium">✓ Enrolled</div>
              )}
              {course.hasCertificate && progress === 100 && (
                <div className="mt-2 text-sm text-amber-600">Certificate available</div>
              )}
            </Card>
            {myEnrollment && (
              <AIStudyCopilot
                lessonContent={selectedLesson?.content || selectedLesson?.title || ""}
                lessonTitle={selectedLesson?.title || "Select a lesson"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
