import ReleaseBase from "./release-base.model"

export default interface ArtistRelease extends ReleaseBase {
    //...
    "artist": string, // only from /artists/{id}/releases, but I want the type system to not complain when I reference it in shared code
    "label": string,
    "format": string,
    "role": string,
    "status": string,
    "type": "release" | "master",
    "main_release": number,
    "stats": {
        "community": {
            "in_wantlist": number,
            "in_collection": number,
        }
    }
}