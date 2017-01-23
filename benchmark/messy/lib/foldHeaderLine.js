module.exports = function foldHeaderLine(str, maxLength, firstLineMaxLength) {
    maxLength = maxLength || 78;
    firstLineMaxLength = firstLineMaxLength || maxLength;
    if (str.length <= firstLineMaxLength) {
        return str;
    }
    var result = '',
        currentLineStartIndex = 0,
        lastSpaceIndex = -1,
        lastSpace,
        isFirstLine = true;
    for (var i = 0 ; i < str.length ; i += 1) {
        if (/^\s$/.test(str[i])) {
            lastSpaceIndex = i;
            lastSpace = str[i];
        }

        if (i - currentLineStartIndex >= (isFirstLine ? firstLineMaxLength : maxLength - 1) && lastSpaceIndex !== -1) {
            result += (isFirstLine ? '' : '\r\n' + lastSpace) + str.substring(currentLineStartIndex, lastSpaceIndex);
            isFirstLine = false;
            i = lastSpaceIndex;
            currentLineStartIndex = i + 1;
            lastSpaceIndex = -1;
        }
    }
    if (i > currentLineStartIndex) {
        result += (isFirstLine ? '' : '\r\n' + lastSpace) + str.substring(currentLineStartIndex, str.length);
    }
    return result;
};
