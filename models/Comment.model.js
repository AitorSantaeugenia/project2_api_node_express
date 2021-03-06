// models/User.model.js
const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
	{
		comments: String,
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		cryptocurrency: {
			type: Schema.Types.ObjectId,
			ref: 'Cryptocurrency'
		}
	},
	{
		timestamps: true
	}
);

module.exports = model('Comment', commentSchema);
