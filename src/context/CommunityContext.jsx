import React, { createContext, useState, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoCommunityPosts, demoComments, demoReputation, demoMentors, demoFollows } from "@/lib/demoData/community";

const STORAGE_KEY = "lms_community";

const getStored = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
    return DEMO_MODE
      ? { posts: demoCommunityPosts, comments: demoComments, reputation: demoReputation, mentors: demoMentors, follows: demoFollows }
      : { posts: [], comments: [], reputation: [], mentors: [], follows: [] };
  } catch {
    return DEMO_MODE
      ? { posts: demoCommunityPosts, comments: demoComments, reputation: demoReputation, mentors: demoMentors, follows: demoFollows }
      : { posts: [], comments: [], reputation: [], mentors: [], follows: [] };
  }
};

const save = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const [data, setData] = useState(getStored());

  const getPostsByCourse = useCallback(
    (courseId) => (data.posts || []).filter((p) => p.courseId === courseId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [data.posts]
  );

  const getCommentsForPost = useCallback(
    (postId) => (data.comments || []).filter((c) => c.postId === postId),
    [data.comments]
  );

  const addPost = useCallback((courseId, authorId, authorName, content) => {
    const post = {
      _id: `cp_${Date.now()}`,
      courseId,
      authorId,
      authorName,
      content,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    const next = { ...data, posts: [post, ...(data.posts || [])] };
    setData(next);
    save(next);
    return post;
  }, [data]);

  const upvotePost = useCallback((postId) => {
    const next = {
      ...data,
      posts: (data.posts || []).map((p) => (p._id === postId ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p)),
    };
    setData(next);
    save(next);
  }, [data]);

  const addComment = useCallback((postId, authorId, authorName, content) => {
    const comment = {
      _id: `cc_${Date.now()}`,
      postId,
      authorId,
      authorName,
      content,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    const next = { ...data, comments: [...(data.comments || []), comment] };
    setData(next);
    save(next);
    return comment;
  }, [data]);

  const getReputation = useCallback(
    (userId) => (data.reputation || []).find((r) => r.userId === userId) || { points: 0, level: "New" },
    [data.reputation]
  );

  const getMentors = useCallback(() => data.mentors || [], [data.mentors]);

  const getGlobalLeaderboard = useCallback(() => {
    const rep = (data.reputation || []).slice().sort((a, b) => (b.points || 0) - (a.points || 0));
    return rep.slice(0, 20);
  }, [data.reputation]);

  const value = {
    getPostsByCourse,
    getCommentsForPost,
    addPost,
    upvotePost,
    addComment,
    getReputation,
    getMentors,
    getGlobalLeaderboard,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};
