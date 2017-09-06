'use strict';

const EventEmitter = require('events');
class CrawlEmitter extends EventEmitter {}
const crawlEmitter = new CrawlEmitter();

const express = require('express');
const http = require('http');
const path = require('path');
const HOST = 'localhost';
const PORT = 80;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const productData = require('./data/available-products.json');

const testData = productData.slice(0, 5); //remove when ready to crawl all pages

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.status(200)
        .type('html')
        .sendFile(path.join(__dirname, '/dist/index.html'));
});

io.on('connection', socket => {
    socket.emit('crawl-ready', { msg: 'Crawler Ready' });

    socket.on('crawl-start', () => {
        crawlEmitter.on('crawled', result => socket.emit('crawl-data', result));
        crawlEmitter.on('error', result => socket.emit('crawl-data', result));
        crawlEmitter.on('errorFatal', err => socket.emit('crawl-error', { success: false, msg: err }));

        require('./crawl-runner')(crawlEmitter, testData).then(results => {
            const successes = results.filter(r => r.success).length;
            const failures = results.length - successes;
            socket.emit('crawl-complete', { results, successes, failures });
        })
        .catch(err => socket.emit('crawl-error', { success: false, msg: err }));
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Crawl Monitor running at: ${HOST}:${PORT}`);
});