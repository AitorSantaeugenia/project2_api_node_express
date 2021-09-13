// services/ApiHandler.js
const axios = require('axios');

// COINLORE API
class coinLoreApi {
	constructor() {
		this.api = axios.create({
			baseURL: 'https://api.coinlore.net/api/tickers/'
		});
	}

	getAllCoins100 = (start) => this.api.get(`?start=${start}`);
}

module.exports = coinLoreApi;
