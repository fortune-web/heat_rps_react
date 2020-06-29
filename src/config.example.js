/* eslint-disable max-len */

const dotenv = require('dotenv').config();
console.log(dotenv)
export const config = {
	
	ACCOUNT: {
		NAME: process.env.NAME || null,
		SECRET: process.env.SECRET || null,
		ID: process.env.ID || null
	},
}

export const API_URL = 'http://localhost:3010/'

export const stages = {
	  LOGIN: 0,
	  LOBBY: 1,
	  START: 2,
	  WAITING_FOR_FIRST: 3,
	  WAITING_FOR_SECOND: 4,
	  RESULTS: 5,
	  FINISHED: 6
	}


export default config;