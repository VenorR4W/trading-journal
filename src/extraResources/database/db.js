const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');

// DB Sqlite3 Connection
class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database('./trading-journal-db.db', (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    })
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve({ id: this.lastID })
        }
      })
    })
  }

  close() {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message);
      } else {
        console.log('Disconnected connection to database')
      }
    })
  };
}

module.exports = AppDAO;