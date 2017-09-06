'use strict';

const { ROOT_DOMAIN, ROOT_URL } = require('./data/config');
const path = require('path');
const fs = require('fs');
const util = require('util');
const puppeteer = require('puppeteer');
const utilities = require('./utilities/utilities-server');

async function run(crawlEmitter, products) {
    try {
        const browser = await puppeteer.launch();
        let resultGroup = [];

        //homepage and sitemap - special cases
        await crawlPage(ROOT_URL);
        await crawlPage(`${ROOT_URL}/sitemap`);
        
        //blogs: have to wait for the page to load, then walk DOM and get all link tags- map to just href value
        const blogPage = await browser.newPage();
        await blogPage.goto(ROOT_URL);
        //blog posts are loaded async, so make sure networkidle event fires before proceeding
        await blogPage.waitForNavigation({waitUntil: 'networkidle'});
        const linksToVisit = await blogPage.evaluate(async () => {
            const links = Array.from(document.querySelectorAll('#blog-home-wrapper a'));
            return Promise.resolve(links.map(link => link.href));
        });
        const blogLinks = linksToVisit.filter(link => {
            return path.parse(link).dir.includes(ROOT_DOMAIN);
        });

        //crawl blog links (not tracked via products json structure- need to get from DOM)
        for(let blogLink of blogLinks) {
            try {
                //crawling the DOM can result in dupes- check for that here
                if(!resultGroup.find(item => item.url === blogLink)) {
                    console.log('crawling:', blogLink);
                    await crawlPage(blogLink);
                }
            } catch(err) {
                handleError(blogLink, err);
            }

        }
        
        //crawl pre-existing product view links (don't need to find these from the DOM)
        for(let product of products) {
            try {
                await crawlPage(`${ROOT_URL}${product.route}`);
            } catch(err) {
                handleError(product.route, err);
            }
        }
        await browser.close();
        
        //write results to file
        const promFS = util.promisify(fs.writeFile);
        const timeStamp = new Date();
        const resultData = `Server cache refresh results for ${timeStamp} \n\n` + 
            resultGroup.sort((a, b) => a.success > b.success)
            .map(result => JSON.stringify(result))
            .join('\n');                    
        
        try {
            await promFS(`./crawl-log/${utilities.formatTimeForFilepath(timeStamp)}-recache-results.txt`, resultData);
        } catch(err) {
            console.log('error writing results:', err);
        }

        async function crawlPage(url) {
            const page = await browser.newPage();
            const pageResult = await page.goto(url);
            let resultObj = { success: pageResult.ok, url };
            resultGroup.push(resultObj);
            crawlEmitter.emit('crawled', resultObj);
            return page.close();
        }
        
        function handleError(url, err) {
            const errorObj = { success: false, url, err };
            resultGroup.push(errorObj);
            crawlEmitter.emit('error', errorObj);
        }
        
        return resultGroup;
    } catch(err) {
        console.log('fatal error:', err);
        crawlEmitter.emit('errorFatal', err);
    }
}

module.exports = run;