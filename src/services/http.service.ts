import jsonp from 'jsonp';
import secrets from '@/app/secrets';

export default /*abstract*/ class JSONPService {
    baseURL = "https://api.discogs.com";


    static appendSecret(url: string): string {
        const beginOrJoinParameters = url.includes('?') ? '&' : '?';
        return url ? `${url}${beginOrJoinParameters}key=${secrets.consumerKey}&secret=${secrets.consumerSecret}` : url;
    }

    private appendToBaseWithSecret(url: string): string {
        return `${this.baseURL}${JSONPService.appendSecret(url)}`;
    }

    /**
     * 
     * @param {string} uri - A resource path, with parameters, to append to the domain, to make a request
     * @returns {Promise<object>}
     */
    async request(uri: string,) {
        return new Promise((resolve, reject) => {
            jsonp(this.appendToBaseWithSecret(uri),
                {
                    param: "callback",
                },
                (err, data) => {
                    if (err) {
                        console.error(err.message);
                        reject(err.message);
                    } else {
                        if (data && data.data) {
                            resolve(data.data);
                        } else {
                            reject("Data did not match expected structure.");
                        }
                    }
                });
        });
    }
}