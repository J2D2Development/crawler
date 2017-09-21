# Crawler

Using Google's cool new Puppeteer browser library to crawl a single page app and store the rendered pages in a local cache.  Testing Vue.js as a UI library.  In progress!

---

### Server Options
| Command | Description |
| ------- | ----------- |
| `npm start` | Start the web UI based interface (port 8000 in dev) |
| `start:cmdline [filter]` | Start the default crawler (or with optional filter) via the command line |
| `start:test` | Start the web UI based interface (port 80) with the test url |
| `start:cmdlinetest` | Start the test url crawler (or with optional filter) via the command line |

### Client Options (crawler-client folder) - all from vue.js CLI
| Command | Description |
| ------- | ----------- |
| `npm start` | serve with hot reload at localhost:8080 |
| `npm run build` | build for production with minification |
| `npm run unit` | run unit tests |

*More coming soon!*

---

### Requirements
+ Node >= 8 (I think- check puppeteer's requirements- easiest if you have async/await)
+ Socket.io
+ vue.js
+ express js