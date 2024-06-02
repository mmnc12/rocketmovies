const parh = require("path");

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: parh.resolve(__dirname, "src", "database", "databaseMovie.db")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      directory: parh.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    useNullAsDefault: true
  },
};
