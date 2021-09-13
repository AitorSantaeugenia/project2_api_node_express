// services/ApiHandler.js
const axios = require('axios');

// COINLORE API
class coinLoreApi {
	constructor() {
		this.api = axios.create({
			baseURL: 'https://api.coinlore.net/api'
		});
	}

	getAllCoins100 = () => this.api.get(`/tickers`);
}

module.exports = coinLoreApi;
