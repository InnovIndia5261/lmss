import React, { useContext } from "react";
import { LiveClassesContext } from "@/context/LiveClassesContext";
import { AcademicsContext } from "@/context/AcademicsContext";
import Card from "@/components/common/Card";
import { FiVideo, FiClock, FiExternalLink } from "react-icons/fi";

const LiveClassesPage = () => {
  const { getUpcomingSessions, sessions } = useContext(LiveClassesContext);
  const { courses } = useContext(AcademicsContext);
  const upcoming = getUpcomingSessions();

  const getCourseTitle = (courseId) => courses.find((c) => c._id === courseId)?.title || "Course";

  const formatCountdown = (scheduledAt) => {
    const diff = new Date(scheduledAt) - new Date();
    if (diff < 0) return "Started";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">Live Classes</h4>
        <p className="text-gray-600 mt-1">Join scheduled sessions</p>
      </div>
      <div className="px-8 space-y-6">
        <Card customClass="bg-white shadow">
          <h5 className="font-bold mb-4 flex items-center gap-2">
            <FiVideo className="text-indigo-500" />
            Upcoming Sessions
          </h5>
          <div className="space-y-4">
            {upcoming.map((session) => (
              <div
                key={session._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300"
              >
                <div>
                  <div className="font-bold">{session.title}</div>
                  <div className="text-sm text-gray-600">{session.description}</div>
                  <div className="text-sm text-gray-500 mt-1">{getCourseTitle(session.courseId)} • {session.instructorName}</div>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="flex items-center gap-1 text-amber-600">
                    <FiClock size={18} />
                    {formatCountdown(session.scheduledAt)}
                  </div>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                      <FiExternalLink size={16} />
                      Join
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {upcoming.length === 0 && <p className="text-center text-gray-500 py-8">No upcoming sessions.</p>}
        </Card>

        <Card customClass="bg-white shadow">
          <h5 className="font-bold mb-4">Completed (with recording)</h5>
          <div className="space-y-2">
            {sessions.filter((s) => s.status === "Completed" && s.recordingLink).map((s) => (
              <div key={s._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{s.title}</span>
                <a href={s.recordingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline">
                  Watch Recording
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveClassesPage;
