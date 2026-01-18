const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },

    // ✅ تم إضافة هذا الحقل لموافقة Admin
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // القيم المسموح بها
      default: "pending", // القيمة الافتراضية عند إنشاء كومنت جديد
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
