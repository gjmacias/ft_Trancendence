import db from './connection.sqlite';

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    password TEXT,
    nickname TEXT NOT NULL,
    email TEXT,
    route_photo TEXT,
    id_google TEXT,
    id_42 TEXT,
    created_at TEXT,
    updated_at TEXT,
    is_active BOOLEAN,
	secret_2FA TEXT,
	active_2FA BOOLEAN,
	privateCount BOOLEAN
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stadistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
  	user_id TEXT NOT NULL,
	elo INTEGER,
    exp INTEGER,
    level INTEGER,
    win_royale INTEGER,
    win INTEGER,
    lost INTEGER,
    max_time TEXT,
    max_score INTEGER,
	FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
	id INTEGER PRIMARY KEY,
	sender_id TEXT NOT NULL,
	receiver_id TEXT NOT NULL,
	content TEXT NOT NULL,
	sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	is_read BOOLEAN DEFAULT 0,
	FOREIGN KEY (sender_id) REFERENCES users(id),
	FOREIGN KEY (receiver_id) REFERENCES users(id)
	)`);

  db.run(`CREATE TABLE IF NOT EXISTS friendships (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	requester_id TEXT NOT NULL,
	addressee_id TEXT NOT NULL,
	status TEXT CHECK(status IN ('pending', 'accepted', 'cancelled')) NOT NULL DEFAULT 'pending',
	requester_blocked BOOLEAN DEFAULT 0,
	addressee_blocked BOOLEAN DEFAULT 0,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(requester_id, addressee_id),
	FOREIGN KEY (requester_id) REFERENCES users(id),
	FOREIGN KEY (addressee_id) REFERENCES users(id)
	)`);
	
	db.run(`CREATE TABLE IF NOT EXISTS match (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	player1_id TEXT NOT NULL,
	player2_id TEXT NOT NULL,
	score1 INTEGER NOT NULL,
	score2 INTEGER NOT NULL,
	winner_id INTEGER,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP,
	duration TEXT,
	mode TEXT,
	FOREIGN KEY (player1_id) REFERENCES users(id),
	FOREIGN KEY (player2_id) REFERENCES users(id),
	FOREIGN KEY (winner_id) REFERENCES users(id)
	)`);

	db.run(`CREATE TABLE IF NOT EXISTS translations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	key TEXT NOT NULL,
	lang_code TEXT NOT NULL,
	text TEXT NOT NULL,
	UNIQUE(key, lang_code)
	)`);

	db.run(`CREATE TABLE IF NOT EXISTS tournament (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	winner TEXT NOT NULL,
	second TEXT NOT NULL,
	rest TEXT NOT NULL,
	finished TEXT DEFAULT CURRENT_TIMESTAMP,
	contract_address TEXT,
	explorer_link TEXT
	);`);
});
