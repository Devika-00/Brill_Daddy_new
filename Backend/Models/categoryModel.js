const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category", // Reference to the parent category
            default: null,   // Root categories will have no parent
        },
    },
    { timestamps: true }
);

// Compound unique index on name and parentCategory
categorySchema.index({ name: 1, parentCategory: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
