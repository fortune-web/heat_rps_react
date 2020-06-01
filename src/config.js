/* eslint-disable max-len */

const dotenv = require('dotenv').config();
console.log(dotenv)
export const config = {
	
	ACCOUNT: {
		NAME: process.env.NAME || null,
		SECRET: process.env.SECRET || null,
		OPPONENT: process.env.OPPONENT || null,
		ID: process.env.ID || null,
	},
	stages: {
	  LOBBY: 1,
	  START: 2,
	  WAITING_FOR_FIRST: 3,
	  WAITING_FOR_SECOND: 3,
	  RESULTS: 5
	}
}


export default config;