/**
 * Simple is object check
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj) {
    return (obj && typeof obj === 'object' && !Array.isArray(obj) && obj !== null);
}

/**
 * Simple is function check
 * @param obj
 * @returns {boolean}
 */
export function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

/**
 * Deep merges two JS objects
 * @param target - target object
 * @param source - source object
 */
export function mergeDeep(target, source) {
    let args = Array.prototype.slice.call(arguments);
    let startIndex = 1;
    let output = Object(target || {});

    // Cycle the source object arguments.
    for (let a = startIndex; a < args.length; a++) {
        var from = args[a];
        var keys = Object.keys(Object(from));

        // Cycle the properties.
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];

            // Merge arrays.
            if (Array.isArray(output[key]) || Array.isArray(from[key])) {
                var o = (Array.isArray(output[key]) ? output[key].slice() : []);
                var f = (Array.isArray(from[key]) ? from[key].slice() : []);
                output[key] = o.concat(f);
            }

            // Copy functions references.
            else if (isFunction(output[key]) || isFunction(from[key])) {
                output[key] = from[key];
            }

            // Extend objects.
            else if (isObject(output[key]) || isObject(from[key])) {
                output[key] = mergeDeep(output[key], from[key]);
            }

            // Copy all other types.
            else {
                output[key] = from[key];
            }
        }
    }
    return output;
}