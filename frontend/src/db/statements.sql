-- USERS TABLE (for login and role-based access)
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'base_commander', 'logistics_officer')) NOT NULL,
  assignedBase TEXT
);

-- ASSETS TABLE
CREATE TABLE IF NOT EXISTS Assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('Vehicle', 'Weapon', 'Ammunition')) NOT NULL,
  openingBalance INTEGER DEFAULT 0,
  closingBalance INTEGER DEFAULT 0,
  assigned INTEGER DEFAULT 0,
  expended INTEGER DEFAULT 0
);

-- PURCHASES TABLE
CREATE TABLE IF NOT EXISTS Purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  quantity INTEGER NOT NULL,
  baseName TEXT,
  date TEXT
);

-- TRANSFERS TABLE
CREATE TABLE IF NOT EXISTS Transfers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assetName TEXT NOT NULL,
  quantity INTEGER,
  sourceBase TEXT,
  destinationBase TEXT,
  timestamp TEXT
);

-- ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS Assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assetName TEXT NOT NULL,
  assignedQuantity INTEGER,
  expendedQuantity INTEGER,
  personnel TEXT,
  baseName TEXT,
  timestamp TEXT
);

-- Admin user
INSERT INTO Users (username, password, role, assignedBase)
VALUES ('boss', 'admin', 'admin', 'Alpha Base');

-- Base Commander
INSERT INTO Users (username, password, role, assignedBase)
VALUES ('commander', 'commander', 'base_commander', 'Bravo Base');

-- Logistics Officer
INSERT INTO Users (username, password, role, assignedBase)
VALUES ('logistics', 'logistics', 'logistics_officer', 'Charlie Base');


SELECT * FROM Users;

DELETE FROM Users;