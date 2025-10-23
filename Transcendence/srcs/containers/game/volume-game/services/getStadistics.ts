import axios from 'axios';

import { PORT_BACKEND } from '../config';
import { httpsAgent } from '../game';

export async function getStadistics(userId: string)
{
	// try
	// {
	// 	const res = await axios.get(`https://backend:${PORT_BACKEND}/backend/game/stadistics/${userId}`, {
	// 		httpsAgent
	// 	});
	// 	return res.data;
	// } catch (err)
	// {
	// 	console.error(err);
	// }
}


export async function getElo(userId : string)
{	
	const stadistics = await getStadistics(userId);		
	return stadistics?.elo ?? null;
}
