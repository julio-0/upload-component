import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './router';
import morgan from 'morgan';
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
mongoose.Promise = global.Promise;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

app.use(router);
console.log(process.env.MONGO_URL);
app.listen(4440);

// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;

// const http = require('http');

// if (cluster.isMaster) {
//   console.log('Master process is running');
//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
// } else {
//   http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end(`Hello from Node.js ${cluster.isMaster ? 'master' : 'child'} process!\n`);
//   }).listen(8000);

//   console.log('Listening on port 8000');
// }