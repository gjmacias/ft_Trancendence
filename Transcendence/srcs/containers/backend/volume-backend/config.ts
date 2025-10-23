import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';


dotenv.config();

const VAULT_ADDR = process.env.VAULT_ADDR || 'http://vault:8200';
const VAULT_TOKEN = process.env.VAULT_TOKEN_ID;

export let NAME: string;

export let CLIENT_ID_GOOGLE: string;
export let CLIENT_SECRET_GOOGLE: string;
export let REDIRECT_URI_GOOGLE: string;

export let CLIENT_ID_42: string;
export let CLIENT_SECRET_42: string;
export let REDIRECT_URI_42: string;

export let JWT_SECRET: string;
export let JWT_2FA_SECRET: string;
export let REFRESH_JWT_SECRET: string;

export let INTERNAL_SECRET_GAME: string;
export let INTERNAL_SECRET_CHAT: string;
export let INTERNAL_SECRET_BACKEND: string;
export let INTERNAL_SECRET_BLOCKCHAIN: string;
export let INTERNAL_SECRET_TOURNAMENT: string;
export let INTERNAL_SECRET_MATCHMAKING: string;


export const PORT_BACKEND = process.env.PORT_BACKEND;
export const PORT_BLOCKCHAIN = process.env.PORT_BLOCKCHAIN;

export async function initSecrets(): Promise<void>
{
	try 
	{
		const httpsAgent = new https.Agent({ rejectUnauthorized: false });

		if (!VAULT_TOKEN)
		{
			throw new Error('VAULT_TOKEN is not defined');
		}
		console.log('Trying to fetch secrets from Vault... ');
		const keys = await axios.get(`${VAULT_ADDR}/v1/transcendence?list=true`, {
			headers: {
			'X-Vault-Token': VAULT_TOKEN,
			},
			httpsAgent,
		});

		console.log('First Fetching complete: ' + JSON.stringify(keys.data.data.keys));

		const vaultSecrets: Record<string, string> = {};
		for (const key of keys.data.data.keys)
		{
			const secretRes = await axios.get(`${VAULT_ADDR}/v1/transcendence/${key}`, {
				headers: {
				'X-Vault-Token': VAULT_TOKEN,
				},
				httpsAgent,
			});
			Object.assign(vaultSecrets, secretRes.data.data);
		}
		
		NAME = process.env.NAME;

		CLIENT_ID_GOOGLE = vaultSecrets["client_id_google"];
		CLIENT_SECRET_GOOGLE = vaultSecrets["client_secret_google"];
		REDIRECT_URI_GOOGLE = vaultSecrets["redirect_uri_google"];

		CLIENT_ID_42 = vaultSecrets["client_id_42"];
		CLIENT_SECRET_42 = vaultSecrets["client_secret_42"];
		REDIRECT_URI_42 = vaultSecrets["redirect_uri_42"];

		JWT_SECRET = vaultSecrets["jwt_secret"];
		JWT_2FA_SECRET = vaultSecrets["jwt_2fa_secret"];
		REFRESH_JWT_SECRET = vaultSecrets["refresh_jwt_secret"];

		INTERNAL_SECRET_GAME = vaultSecrets["internal_secret_game"];
		INTERNAL_SECRET_CHAT = vaultSecrets["internal_secret_chat"];
		INTERNAL_SECRET_BACKEND = vaultSecrets["internal_secret_backend"];
		INTERNAL_SECRET_BLOCKCHAIN = vaultSecrets["internal_secret_blockchain"];
		INTERNAL_SECRET_TOURNAMENT = vaultSecrets["internal_secret_tournament"];
		INTERNAL_SECRET_MATCHMAKING = vaultSecrets["internal_secret_matchmaking"];
		console.log('Secrets successfully retrieved from Vault');
	} 
	catch (error) 
	{
		if (axios.isAxiosError(error))
		{
			if (error.response) 
			{
				console.error('Vault error response:', error.response.status, error.response.data);
			} else if (error.request) {
				console.error('No response from Vault:', error.request);
			} else {
				console.error('Axios error:', error.message);
			}
		} 
		else 
		{
			console.error('Unknown error:', error);
		}
		NAME = process.env.NAME;
		CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE;
		CLIENT_SECRET_GOOGLE = process.env.CLIENT_SECRET_GOOGLE;
		REDIRECT_URI_GOOGLE = process.env.REDIRECT_URI_GOOGLE;
		CLIENT_ID_42 = process.env.CLIENT_ID_42;
		CLIENT_SECRET_42 = process.env.CLIENT_SECRET_42;
		REDIRECT_URI_42 = process.env.REDIRECT_URI_42;
		JWT_SECRET = process.env.JWT_SECRET;
		JWT_2FA_SECRET = process.env.JWT_2FA_SECRET;
		REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
		INTERNAL_SECRET_GAME = process.env.INTERNAL_SECRET_GAME;
		INTERNAL_SECRET_CHAT = process.env.INTERNAL_SECRET_CHAT;
		INTERNAL_SECRET_BACKEND = process.env.INTERNAL_SECRET_BACKEND;
		INTERNAL_SECRET_BLOCKCHAIN = process.env.INTERNAL_SECRET_BLOCKCHAIN;
		INTERNAL_SECRET_TOURNAMENT = process.INTERNAL_SECRET_TOURNAMENT;
		INTERNAL_SECRET_MATCHMAKING = process.INTERNAL_SECRET_MATCHMAKING;
	}
}
