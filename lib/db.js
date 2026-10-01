import { Sequelize, DataTypes } from "sequelize";

// Singleton pattern - reuse the connection across hot reloads in dev
let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || null,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      dialect: "mysql",
      logging: false,
    }
  );
} else {
  // In development, reuse connection across hot reloads
  if (!global._sequelize) {
    global._sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD || null,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        logging: console.log,
      }
    );
  }
  sequelize = global._sequelize;
}

// ─── Define models statically (no dynamic require / fs.readdirSync) ───────────

const User = sequelize.define(
  "User",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { tableName: "Users" }
);

// ─── Exports ──────────────────────────────────────────────────────────────────
export { sequelize, User };
