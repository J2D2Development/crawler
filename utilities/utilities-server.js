'use strict';

function formatTimeForFilepath(timeStamp) {
    const year = timeStamp.getFullYear();
    const month = padZeros(timeStamp.getMonth() + 1);
    const date = padZeros(timeStamp.getDate());
    const hour = padZeros(timeStamp.getHours());
    const minutes = padZeros(timeStamp.getMinutes());
    const seconds = padZeros(timeStamp.getSeconds());

    return `${year}-${month}-${date}-at-${hour}-${minutes}-${seconds}`;
}

function padZeros(num) {
    const numAsStr = num.toString();
    return numAsStr.length === 1 ? `0${numAsStr}` : numAsStr; 
}

module.exports = {
    formatTimeForFilepath
};