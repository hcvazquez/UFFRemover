import * as Rx  from 'rxjs/Rx';

export class AsyncLoader {
    /**
     * @public
     * @name load
     * @param {String} url - url of i18n JSON file
     * @returns {Observable}
     */
    load(url) {
        return Rx.Observable.fromPromise(new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);

            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        console.error(`[Chomsky] (${url}) - Parse Error: ${e.toString()}`);
                        reject(new Error(`Parse Error: ${e.toString()}`));
                    }
                } else {
                    reject(new Error(xhr.statusText));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Network Error'));
            };

            xhr.send();
        }));
    }
}