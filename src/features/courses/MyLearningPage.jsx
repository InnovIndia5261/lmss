import React, { useContext } from "react";
import { Link } from "react-router";
import { AcademicsContext } from "@/context/AcademicsContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import PerformancePanel from "@/features/performance/PerformancePanel";
import { FiBook, FiFileText, FiClipboard } from "react-icons/fi";

const MyLearningPage = () => {
  const { courses, enrollments, assignments, submissions, exams, examAttempts } = useContext(AcademicsContext);
  const { user } = useAuth();

  const myEnrollments = enrollments.filter((e) => e.studentId === user?._id);
  const myCourses = myEnrollments.map((e) => courses.find((c) => c._id === e.courseId)).filter(Boolean);

  const upcomingAssignments = assignments.filter((a) => {
    const due = new Date(a.dueDate);
    const submitted = submissions.some((s) => s.assignmentId === a._id && s.studentId === user?._id);
    return due > new Date() && !submitted && myEnrollments.some((e) => e.courseId === a.courseId);
  }).slice(0, 5);

  const mySubmissions = submissions.filter((s) => s.studentId === user?._id);
  const pendingGrading = mySubmissions.filter((s) => s.status === "Submitted").length;

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">My Learning</h4>
      </div>
      <div className="px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div>
              <h5 className="font-bold mb-4">Enrolled Courses</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map((course) => {
              const en = myEnrollments.find((e) => e.courseId === course._id);
              return (
                <Link key={course._id} to={`/courses/${course._id}`}>
                  <Card customClass="bg-white shadow hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <FiBook className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <div className="font-bold">{course.title}</div>
                        <div className="text-sm text-gray-600">{en?.progressPercent ?? 0}% complete</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${en?.progressPercent ?? 0}%` }}
                      />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          {myCourses.length === 0 && (
            <p className="text-gray-500">You are not enrolled in any courses. <Link to="/courses" className="text-indigo-600 hover:underline">Browse courses</Link></p>
          )}
            </div>

            <div className="mt-8">
          <h5 className="font-bold mb-4">Upcoming Assignments</h5>
          <div className="space-y-2">
            {upcomingAssignments.map((a) => {
              const course = courses.find((c) => c._id === a.courseId);
              return (
                <Link key={a._id} to={`/courses/${a.courseId}/assignments/${a._id}`}>
                  <Card customClass="bg-white shadow hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-indigo-500" size={24} />
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-gray-600">{course?.title} • Due {new Date(a.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          {upcomingAssignments.length === 0 && <p className="text-gray-500">No upcoming assignments.</p>}
            </div>

            {pendingGrading > 0 && (
          <Card customClass="bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2">
              <FiClipboard className="text-amber-600" size={24} />
              <span>{pendingGrading} submission(s) pending grading</span>
            </div>
          </Card>
            )}
          </div>
          <div>
            <PerformancePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;
