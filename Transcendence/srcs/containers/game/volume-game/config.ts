import dotenv from 'dotenv';

dotenv.config();

export const {
	PORT_GAME ,
	PORT_BACKEND ,
	JWT_SECRET,
	REFRESH_JWT_SECRET,
	INTERNAL_SECRET_GAME,
} = process.env
