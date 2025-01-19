export interface Album {
    "artist": string, // only from /artists/{id}/releases
    "country": string,
    "year": string,
    "format": [string],
    "label": [string],
    "type": string,
    "genre": [string],
    "style": [string],
    "id": number,
    "barcode": [string],
    "master_id": number,
    "master_url": string,
    "uri": string,
    "catno": string,
    "title": string,
    "thumb": string,
    "cover_image": string,
    "resource_url": string,
    "community": {
        "want": number,
        "have": number
    }
};
