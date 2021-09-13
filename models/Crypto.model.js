// models/User.model.js
const { Schema, model } = require('mongoose');

const cryptoSchema = new Schema(
	{
		name: String,
		symbol: String,
		price_usd: Number,
		percent_change_24h: Number,
		percent_change_1h: Number,
		percent_change_7d: Number,
		apiID: Number
	},
	{
		timestamps: true
	}
);

module.exports = model('Cryptocurrency', cryptoSchema);
