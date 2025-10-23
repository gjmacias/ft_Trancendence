// src/routes/user.route.ts
import multer from 'fastify-multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: '../database/uploads/',
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + '-' + file.originalname;
		cb(null, uniqueName);
	}
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
	const allowed = ['.jpg', '.jpeg', '.png'];
	const ext = path.extname(file.originalname).toLowerCase();
	const isImage = file.mimetype.startsWith('image/');
	if (allowed.includes(ext) && isImage) {
		cb(null, true);
	} else {
		cb(new Error('Archivo no permitido'), false);
	}
};

export const upload = multer({ storage, fileFilter });
