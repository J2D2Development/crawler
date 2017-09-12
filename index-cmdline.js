'use strict';

const productData = require('./data/available-products.json');
const utilities = require('./utilities/utilities-server');
const dataFilter = process.argv[2];

let toCrawl = productData;
if(dataFilter) {
    try {
        toCrawl = utilities.applyDataFilter(dataFilter, toCrawl);
    } catch(err) {
        console.log(err.message);
        process.exit();
    }
}

const startTime = new Date();
console.log(`Site crawl started at ${startTime}`);
console.log('Filter applied:', dataFilter ? dataFilter : 'None', '\n');

require('./crawl-runner')(toCrawl).then(results => {
    const successes = results.filter(r => r.success).length;
    const failures = results.length - successes;
    const endTime = new Date();
    const { minutes, seconds } = utilities.formatTimeDiff(endTime.getTime() - startTime.getTime());
    console.log(`\n\nSite crawl complete at ${endTime}`);
    console.log(`Total time: ${minutes} minutes, ${seconds} seconds`);
    console.log('success:', successes, 'fail:', failures);
}).catch(err => console.log('crawl-error', err));