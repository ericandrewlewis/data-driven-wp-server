# data-driven-wp-server

To start:

Install brew if you don't have it.

Run `npm install` in this folder.

Install mongodb (`brew install mongod`, assuming you have brew)

Create a `data/` folder in this folder. This will hold mongodb data.

Run mongodb (`mongod --dbpath=data --port 27017`). This will take over the window running the daemon and log output.

In a separate window, run the application `node index.js`