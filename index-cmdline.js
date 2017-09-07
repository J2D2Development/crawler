'use strict';

const productData = require('./data/available-products.json');

const testData = productData.slice(0, 5); //remove when ready to crawl all pages

console.log('Site crawl started...');

require('./crawl-runner')(testData).then(results => {
    const successes = results.filter(r => r.success).length;
    const failures = results.length - successes;
    console.log('\n\nSite crawl complete!\n', 'success:', successes, 'fail:', failures);
}).catch(err => console.log('crawl-error', err));