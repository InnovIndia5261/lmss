import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { CommunityContext } from "@/context/CommunityContext";
import { AcademicsContext } from "@/context/AcademicsContext";
import useAuth from "@/hooks/useAuth";
import Card from "@/components/common/Card";
import { FiMessageCircle, FiThumbsUp } from "react-icons/fi";

const CommunityCoursePage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { getPostsByCourse, getCommentsForPost, addPost, upvotePost } = useContext(CommunityContext);
  const { courses } = useContext(AcademicsContext);
  const [newPost, setNewPost] = useState("");

  const course = courses?.find((c) => c._id === courseId);
  const posts = getPostsByCourse(courseId);

  const handleAddPost = () => {
    if (!newPost.trim() || !user) return;
    addPost(courseId, user._id, user.name, newPost.trim());
    setNewPost("");
  };

  if (!course) return <div className="p-8">Course not found</div>;

  return (
    <div className="px-6 py-8">
      <div className="page-header-subtle mb-8">
        <h4 className="heading-1">Discussion: {course.title}</h4>
        <p className="label-muted mt-1">Ask questions and share insights</p>
      </div>

      {user && (
        <Card customClass="!p-6 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Start a discussion..."
            className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <button onClick={handleAddPost} disabled={!newPost.trim()} className="btn-primary mt-2">
            Post
          </button>
        </Card>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id} customClass="!p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{post.authorName}</div>
                <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => upvotePost(post._id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
              >
                <FiThumbsUp size={16} /> {post.upvotes || 0}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card customClass="!p-12 text-center">
          <FiMessageCircle className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">No discussions yet. Be the first to post!</p>
        </Card>
      )}
    </div>
  );
};

export default CommunityCoursePage;
