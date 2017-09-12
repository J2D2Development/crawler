'use strict';
const VALID_FILTERS = ['Test', 'Base', 'Accounting', 'Banking', 'Central Banking', 'Investment', 'Trust', 'Module Options'];

function applyDataFilter(filter, data) {
    if(!VALID_FILTERS.includes(filter)) {
        throw new Error(`${filter} is not a valid filter\nValid filters are: ${VALID_FILTERS.join(', ')}`);
    }
    if(filter === 'Test') { return data.slice(0, 5); }
    return data.filter(d => d.module === filter);
}

function formatTimeForFilepath(timeStamp) {
    const year = timeStamp.getFullYear();
    const month = padZeros(timeStamp.getMonth() + 1);
    const date = padZeros(timeStamp.getDate());
    const hour = padZeros(timeStamp.getHours());
    const minutes = padZeros(timeStamp.getMinutes());
    const seconds = padZeros(timeStamp.getSeconds());

    return `${year}-${month}-${date}-at-${hour}-${minutes}-${seconds}`;
}

function formatTimeDiff(millis) {
    const minutes = Math.floor(millis / (1000 * 60));
    const seconds =  Math.floor(millis / 1000) - (minutes * 60);
    return { 
        minutes: minutes >= 1 ? padZeros(minutes) : '00', 
        seconds: seconds >= 1 ? padZeros(seconds) : '00' };
}

function padZeros(num) {
    const numAsStr = num.toString();
    return numAsStr.length === 1 ? `0${numAsStr}` : numAsStr; 
}

module.exports = {
    formatTimeForFilepath, formatTimeDiff, applyDataFilter
};