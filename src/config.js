/* eslint-disable max-len */
import { acc1, acc2 } from './accounts.js'

export const config = {

	ACCOUNT2: {
		NAME: acc2.NAME,
		SECRET: acc2.SECRET,
		ID: acc2.ID
	},

	ACCOUNT: {
		NAME: acc1.NAME,
		SECRET: acc1.SECRET,
		ID: acc1.ID
	},
}

export const mainAccount = '6768971178720561498';

export const API_URL = 'http://localhost:3010/'; // 'http://rps.ethernity.live:3010/''

export const stages = {
	  LOGIN: 0,
	  LOBBY: 1,
	  CREATED: 2,
	  STARTED: 3,
	  FUNDED: 4,
	  RESULTS: 5,
	  FINISHED: 6
	}

export default config;