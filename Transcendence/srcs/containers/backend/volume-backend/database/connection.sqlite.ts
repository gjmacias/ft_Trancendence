import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, './database-sqlite/database.sqlite');

// Abrir o crear la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con SQLite:', err.message, dbPath);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

export default db;