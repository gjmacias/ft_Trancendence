import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Ruta a tu base de datos
const dbPath = path.resolve(__dirname, '../database/database-sqlite/database.sqlite');
const backupDir = path.resolve(__dirname, '../database/backups-sqlite');

// Crear carpeta backups si no existe
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

/*
 * Elimina backups antiguos del mismo tipo (hora, día, etc.)
 */
const removeOldBackupOfType = (type) => {
  const files = fs.readdirSync(backupDir);
  const prefix = `backup-${type}`;
  files.forEach(file => {
    if (file.startsWith(prefix)) {
      fs.unlinkSync(path.join(backupDir, file));
    }
  });
};

// Función que hace el backup
const makeBackup = (type) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `backup-${type}-${timestamp}.sqlite.gz`;
  const backupPath = path.join(backupDir, backupFilename);

  removeOldBackupOfType(type);

  const input = fs.createReadStream(dbPath);
  const output = fs.createWriteStream(backupPath);
  const gzip = zlib.createGzip();

  input.pipe(gzip).pipe(output);

  output.on('finish', () => {
    console.log(`📦 Backup creado en ${backupPath}`);
  });

  output.on('error', (err) => {
    console.error('❌ Error al crear backup:', err);
  });
};

// 🕑 Ejecutar cada hora (puedes cambiar el cron)
cron.schedule('0 * * * *', () => makeBackup('hour'));         // Cada hora
cron.schedule('0 0 * * *', () => makeBackup('day'));          // Cada día
cron.schedule('0 0 * * 0', () => makeBackup('week'));         // Cada semana
cron.schedule('0 0 1 * *', () => makeBackup('month'));        // Cada mes
cron.schedule('0 0 1 1,7 *', () => makeBackup('semester'));   // Cada 6 meses

console.log('🕒 Tarea CRON de backup activa...');
