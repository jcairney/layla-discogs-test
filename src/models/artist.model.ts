export default interface Artist {
    "name": string,
    "id": number,
    "resource_url": string,
    "uri": string,
    "releases_url": string,
    "images": [
        {
            "type": string,
            "uri": string,
            "resource_url": string,
            "uri150": string,
            "width": number,
            "height": number,
        },
    ],
    "realname": string,
    "profile": string,
    "urls": [
        string,
    ],
    "namevariations": [
        string,
    ],
    "aliases": [
        {
            "id": number,
            "name": string,
            "resource_url": string
        },
    ],
    "data_quality": string,
}

