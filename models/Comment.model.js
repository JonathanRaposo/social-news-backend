

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        content: String,
        article: { type: Schema.Types.ObjectId, ref: 'Article' }
    },
    {
        timestamps: true
    }
);
module.exports = model("Comment", commentSchema);