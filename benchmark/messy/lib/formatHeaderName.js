var headerNameSpecialCases = require('./headerNameSpecialCases');

/**
 * Convert a header name to its canonical form,
 * e.g. "content-length" => "Content-Length".
 * @param headerName the header name (case insensitive)
 * @return {String} the formatted header name
 */
function formatHeaderName(headerName) {
    var lowerCasedHeaderName = headerName.toLowerCase();
    if (headerNameSpecialCases.hasOwnProperty(lowerCasedHeaderName)) {
        return headerNameSpecialCases[lowerCasedHeaderName];
    } else {
        // Make sure that the first char and all chars following a dash are upper-case:
        return lowerCasedHeaderName.replace(/(^|-)([a-z])/g, function ($0, optionalLeadingDash, ch) {
            return optionalLeadingDash + ch.toUpperCase();
        });
    }
}

module.exports = formatHeaderName;
