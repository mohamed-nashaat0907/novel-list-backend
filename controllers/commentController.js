const Comment = require("../models/comment");
const mongoose = require("mongoose");
const UserAuth = require("../models/userAuthModel");
const Logger = require("../services/loggerService");
const logger = new Logger("comment.controller");

// === Existing functions ===
const createComment = async (comment) => {
  try {
    logger.info("Creating comment:", comment);
    const savedComment = await comment.save();
    return savedComment;
  } catch (error) {
    logger.error("Error saving comment:", error);
    throw error;
  }
};

// ✅ تم التعديل هنا: أضفنا معامل onlyApproved لفلترة الكومنتات للمستخدم النهائي
const listComments = async (id, onlyApproved = false) => {
  try {
    logger.info("Listing comments for book ID:", id);
    const filter = { bookId: id };
    if (onlyApproved) filter.status = "approved"; // فلترة الكومنتات المعتمدة فقط

    const comments = await Comment.find(filter).populate("userId", "name");
    return comments;
  } catch (error) {
    logger.error("Error listing comments:", error);
    throw error;
  }
};

const getAverageReview = (comments) => {
  logger.info("Calculating average review");
  if (!comments || comments.length === 0) return 0;
  const sumReviews = comments.reduce((sum, comment) => sum + comment.rate, 0);
  return sumReviews / comments.length;
};

const deleteComment = async (commentId, userId) => {
  logger.info(`Deleting comment with ID: ${commentId} by user: ${userId}`);
  try {
    const isOwner = await CheckAuthorityOfComment(commentId, userId);
    if (!isOwner) {
      const error = new Error("Not the owner of the comment");
      error.status = 403;
      throw error;
    }
    const deleted = await Comment.findByIdAndDelete(commentId);
    return deleted;
  } catch (error) {
    logger.error(`Error deleting comment with ID: ${commentId}`, error);
    throw error;
  }
};

const CheckAuthorityOfComment = async (commentId, userId) => {
  logger.info(
    `Checking authority for comment ID: ${commentId} by user: ${userId}`
  );
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return false;
    return comment.userId.toString() === userId.toString();
  } catch (error) {
    logger.error(
      `Error checking authority for comment ID: ${commentId}`,
      error
    );
    return false;
  }
};

const getUserComments = async (userId) => {
  try {
    logger.info(`Fetching comments for user ID: ${userId}`);
    const comments = await Comment.find({ userId }).populate(
      "bookId",
      "title author imageCover"
    );
    return comments;
  } catch (error) {
    logger.error(`Error fetching comments for user ID: ${userId}`, error);
    throw error;
  }
};

const updateComment = async (commentId, userId, updatedFields) => {
  try {
    logger.info(`Updating comment ID: ${commentId} by user: ${userId}`);
    const isOwner = await CheckAuthorityOfComment(commentId, userId);
    if (!isOwner) {
      const error = new Error("Not the owner of the comment");
      error.status = 403;
      throw error;
    }
    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { $set: updatedFields },
      { new: true }
    );
    return updated;
  } catch (error) {
    logger.error(`Error updating comment ID: ${commentId}`, error);
    throw error;
  }
};

// === New Admin functions ===

// 1️⃣ Get all comments (Admin) with filtering and pagination
const getAllCommentsAdmin = async ({
  status,
  bookId,
  userId,
  page = 1,
  limit = 10,
}) => {
  try {
    const filter = {};
    if (status) filter.status = status;
    if (bookId) filter.bookId = bookId;
    if (userId) filter.userId = userId;

    const skip = (page - 1) * limit;

    const comments = await Comment.find(filter)
      .populate("userId", "name email")
      .populate("bookId", "title author")
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments(filter);

    return {
      comments,
      pagination: {
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    };
  } catch (error) {
    logger.error("Error fetching all comments for admin:", error);
    throw error;
  }
};

// 2️⃣ Update comment status (approve/reject)
const updateCommentStatus = async (commentId, status) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error("Comment not found");
      error.status = 404;
      throw error;
    }

    if (!["approved", "rejected"].includes(status)) {
      const error = new Error("Invalid status");
      error.status = 400;
      throw error;
    }

    comment.status = status;
    await comment.save();

    return comment;
  } catch (error) {
    logger.error(`Error updating comment status for ID ${commentId}:`, error);
    throw error;
  }
};

module.exports = {
  createComment,
  listComments, // ✅ الآن يدعم فلترة المستخدم النهائي
  deleteComment,
  getAverageReview,
  getUserComments,
  updateComment,
  getAllCommentsAdmin,
  updateCommentStatus,
};
