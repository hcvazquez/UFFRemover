module.exports = function decodeTransferEncodingChunked(body) {
    var chunks = [],
        index = 0,
        nextChunkLength,
        nextChunkLengthHex;
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
        while (index < body.length) {
            nextChunkLengthHex = '';
            while (index < body.length && body[index] !== 0xd) {
                var hexChar = String.fromCharCode(body[index]);
                if (!/[0-9a-f]/i.test(hexChar)) {
                    throw new Error('decodeTransferEncodingChunked: Invalid hex char when decoding chunk length: ' + hexChar);
                }
                nextChunkLengthHex += hexChar;
                index += 1;
            }
            if (body[index] === 0xd && body[index + 1] === 0xa) {
                index += 2;
                nextChunkLength = parseInt(nextChunkLengthHex, 16);
                if (nextChunkLength === 0) {
                    return Buffer.concat(chunks);
                } else if (nextChunkLength > 0 && body.length >= index + nextChunkLength) {
                    chunks.push(body.slice(index, index + nextChunkLength));
                    index += nextChunkLength;
                    // We do a best effort and exit if we've reached the end of some partial body
                    if (index === body.length || (index + 2 === body.length && body[index] === 0xd && body[index + 1] === 0xa)) {
                        return Buffer.concat(chunks);
                    }
                    if (index + 2 >= body.length || body[index] !== 0xd || body[index + 1] !== 0xa) {
                        throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk');
                    } else {
                        index += 2;
                    }
                } else {
                    throw new Error('decodeTransferEncodingChunked: Parse error, not enough data to consume a chunk of ' + nextChunkLength + ' byte(s)');
                }
            } else {
                throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk length');
            }
        }
    } else {
        // Assume string
        while (index < body.length) {
            nextChunkLengthHex = '';
            while (index < body.length && body[index] !== '\r') {
                nextChunkLengthHex += body[index];
                index += 1;
            }
            if (body[index] === '\r' && body[index + 1] === '\n') {
                index += 2;
                nextChunkLength = parseInt(nextChunkLengthHex, 16);
                if (nextChunkLength === 0) {
                    return chunks.join('');
                } else if (nextChunkLength > 0 && body.length >= index + nextChunkLength) {
                    chunks.push(body.slice(index, index + nextChunkLength));
                    index += nextChunkLength;
                    // We do a best effort and exit if we've reached the end of some partial body
                    if (index === body.length || (index + 2 === body.length && body[index] === '\r' && body[index + 1] === '\n')) {
                        return chunks.join('');
                    }
                    if (index + 2 >= body.length || body[index] !== '\r' || body[index + 1] !== '\n') {
                        throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk');
                    } else {
                        index += 2;
                    }
                } else {
                    throw new Error('decodeTransferEncodingChunked: Parse error, not enough data to consume a chunk of ' + nextChunkLength + ' byte(s)');
                }
            } else {
                throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk length');
            }
        }
    }
};
