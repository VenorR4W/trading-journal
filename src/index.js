const { app, BrowserWindow } = require('electron');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./trading-journal-db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the trading-journal database.');
  });

// DB Sqlite3 Connection
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./trading-journal-db.sqlite",
    useNullAsDefault: true
  }
});

knex.schema.createTable('trades', (table) => {
  table.increments('id').primary;
  table.timestamps('created_at');
  table.timestamps('closed_at');
  table.string('asset');
  table.boolean('long_short');
  table.decimal('entry', 2, 2);
  table.decimal('target', 2, 2);
  table.decimal('stop_loss', 2, 2);
  table.string('risk');
  table.decimal('size', 2, 2);
}).then(() => console.log("table trades was created"))
.catch((err) => { console.log(err); throw err })
.finally(() => {
    knex.destroy();
});

knex.schema.createTable('account', function (table) {
  table.increments('id').primary;
  table.decimal('value', 2, 2);
  table.timestamps('created_at');
}).then(() => console.log("table account was created"))
.catch((err) => { console.log(err); throw err })
.finally(() => {
    knex.destroy();
});

console.log("hello");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  
  //

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
