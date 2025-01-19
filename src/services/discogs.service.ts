import jsonp from 'jsonp';
import secrets from '@/app/secrets';


/**
 * Collection of methods for querying the Discogs API
 */

const baseURL = "https://api.discogs.com";


function appendSecret(url: string): string {
    const beginOrJoinParameters = url.includes('?') ? '&' : '?';
    return url ? `${url}${beginOrJoinParameters}key=${secrets.consumerKey}&secret=${secrets.consumerSecret}` : url;
}

function _appendToBaseWithSecret(url: string): string {
    return `${baseURL}${appendSecret(url)}`;
}

/**
 * 
 * @param {string} uri - A resource path, with parameters, to append to the domain, to make a request
 * @returns {Promise<object>}
 */
async function _request(uri: string,) {
    return new Promise((resolve, reject) => {
        jsonp(_appendToBaseWithSecret(uri),
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

function getArtistReleases(artistId: number): Promise {
    // TODO: Move the unpacking of the data structure into these endpoint methods
    return _request(`/artists/${artistId}/releases?per_page=100`);
}

function getArtist(artistId: string): Promise {
    return _request(`/artists/${artistId}`);
}

function searchReleases(filters: string): Promise {
    // TODO: accept filter dictionary and convert to URL parameters
    return _request(`/database/search?${filters}&type=release`);
}

function searchArtists(artistName: string): Promise {
    return _request(`/database/search?q=${artistName}&type=artist&per_page=10000`);
}

const service = { appendSecret, getArtistReleases, searchReleases, searchArtists, getArtist };
export default service;