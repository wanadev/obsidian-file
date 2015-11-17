"use strict";

function numberToBigEndianArray(number, bytes) {
    if (number >= Math.pow(2, 8*bytes)) {
        throw new Error("NumberTooLarge");
    }
    var result = [];
    for (var i = 0 ; i < bytes ; i++) {
        result[bytes-i-1] = number >> i*8 & 0xFF;
    }
    return result;
}

function bigEndianArrayToNumber(array) {
    var result = 0;
    for (var i = 0 ; i < array.length ; i++) {
        result += array[i] << (array.length-i-1)*8;
    }
    return result;
}

module.exports = {
    numberToBigEndianArray: numberToBigEndianArray,
    bigEndianArrayToNumber: bigEndianArrayToNumber
};
