const router = require("express").Router();
const Comment = require("../../models/comments/Comment");
const Post = require("../../models/posts/Post");
const { verifyToken } = require("../../middleware/verifyToken");

// Add comment to post
router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    // Create new comment
    const newComment = new Comment({
      postId: req.params.id,
      userId: req.user.id,
      username: req.user.username,
      text: req.body.text,
    });

    // Save the comment
    const savedComment = await newComment.save();

    // Update the post with matching structure
    await Post.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: {
          commenterId: req.user.id,
          commenterUsername: req.user.username,
          content: req.body.text,
        },
      },
      $inc: { commentCount: 1 },
    });

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete comment
router.delete("/:id/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns comment or is admin
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    // Delete from Comments collection
    await Comment.findByIdAndDelete(req.params.commentId);

    // Update the post - remove comment and decrement count
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: {
        comments: {
          commenterId: comment.userId,
          commenterUsername: comment.username,
          content: comment.text,
        },
      },
      $inc: { commentCount: -1 },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;