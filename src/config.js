/* eslint-disable max-len */

const dotenv = require('dotenv').config();
console.log(dotenv)
export const config = {
	
	ACCOUNT: {
		NAME: process.env.NAME || null,
		SECRET: process.env.SECRET || null,
		ID: process.env.ID || null,
		OPPONENT: process.env.OPPONENT || null,
	},
	ACCOUNT2: {
		NAME: process.env.NAME2 || null,
		SECRET: process.env.SECRET2 || null,
		ID: process.env.ID2 || null,
		OPPONENT: process.env.OPPONENT2 || null 
	},
	stages: {
	  LOBBY: 1,
	  START: 2,
	  WAITING_FOR_FIRST: 3,
	  WAITING_FOR_SECOND: 4,
	  RESULTS: 5,
	  FINISHED: 6
	}
}


export default config;