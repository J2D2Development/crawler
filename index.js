'use strict';

const EventEmitter = require('events');
class CrawlEmitter extends EventEmitter {}
const crawlEmitter = new CrawlEmitter();

const cron = require('node-cron');
const express = require('express');
const http = require('http');
const path = require('path');
const HOST = 'localhost';
const PORT = 80;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const utilities = require('./utilities/utilities-server');
const productData = require('./data/available-products.json');

//example only!
// cron.schedule('* * * * *', function() {
//     console.log('cron running every minute!', new Date().getMinutes());
// });

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.status(200)
        .type('html')
        .sendFile(path.join(__dirname, '/dist/index.html'));
});

io.on('connection', socket => {
    socket.emit('crawl-ready', { msg: 'Crawler Ready' });

    socket.on('crawl-start', data => {
        let toCrawl = productData;
        let startTime = new Date();

        //user can submit a filter to only crawl certain categories
        if(data.filter) {
            try {
                toCrawl = utilities.applyDataFilter(data.filter, toCrawl);
            } catch(err) {
                socket.emit('crawl-error', {
                    success: false,
                    msg: err.message
                });
                return;
            }
        }

        crawlEmitter.on('crawled', result => socket.emit('crawl-data', result));
        crawlEmitter.on('error', result => socket.emit('crawl-data', result));
        crawlEmitter.on('errorFatal', err => socket.emit('crawl-error', { success: false, msg: err }));

        require('./crawl-runner')(toCrawl, crawlEmitter).then(results => {
            const successes = results.filter(r => r.success).length;
            const failures = results.length - successes;
            const endTime = new Date();
            const { minutes, seconds } = utilities.formatTimeDiff(endTime.getTime() - startTime.getTime());
            socket.emit('crawl-complete', { results, successes, failures, minutes, seconds });
        })
        .catch(err => socket.emit('crawl-error', { success: false, msg: err }));
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Crawl Monitor running at: ${HOST}:${PORT}`);
});