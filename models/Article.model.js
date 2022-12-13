
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const articleSchema = new Schema(
    {
        external_id: String,
        image: String,
        url: String,
        name: String,
        description: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    },
    {
        timestamps: true
    }
);

module.exports = model('Article', articleSchema);