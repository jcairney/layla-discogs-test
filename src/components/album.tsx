import Image from "next/image";
import { Album } from "../models/album.model";
import JSONPService from "../services/http.service";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import FavouriteComponent from "./favourite";
import { useFavourites } from "./favourites.context-provider";

export default function AlbumComponent({ album, apiService, showYear = false }: { album: Album, apiService: JSONPService, showYear: boolean }) {
    const imageStyle = {
        display: 'inline',
    }

    const router = useRouter();

    const url = JSONPService.appendSecret(album.thumb) || null;
    let [artist, albumTitle] = (album.title || " - ").split(" - ");
    // for data coming from /artists/{id}/releases
    if (!albumTitle) {
        albumTitle = artist;
        if (album.artist) {
            artist = album.artist;
        } else {
            artist = "";
        }
    }

    const goToArtist = useCallback(() => {
        apiService.request(`/database/search?q=${artist}&type=artist&per_page=10000`).then((result) => {

            // Releases returned by the search endpoint do not include artist ID.  We wouldn't even need a click handler, if artist ID was there on the album.
            // ALSO, the https://api.discogs.com/releases/{id} endpoint does not support JSONP, or we could get artist ID by querying the full album entry.
            // So we are doing a search of artist by name, then doing an artist release search on each artist ID returned from the first search,
            // and checking the releases by those artists to find the album we just clicked artist on, proving that was the right artist.
            // Once we've identified the correct artist, we can navigate to the artist route, supplying the correct artist ID.
            if (result && Array.isArray(result?.results)) {
                const artistReleaseQueries = [];
                const artistsBeingChecked = [];
                for (let artistResult of result.results) {
                    if (artistResult.title === artist) {
                        artistsBeingChecked.push(artistResult)
                        artistReleaseQueries.push(apiService.request(`/artists/${artistResult.id}/releases?&per_page=10000`));
                    }
                }
                Promise.all(artistReleaseQueries).then((responses) => {
                    let matchingArtist;
                    responses.forEach((response, index: number) => {
                        if (response && Array.isArray(response.releases)) {
                            for (let release of response.releases) {
                                if (release.id === album.id || release.id === album.master_id) {
                                    matchingArtist = artistsBeingChecked[index];
                                }
                            }
                        }
                    })
                    if (matchingArtist) {
                        router.push(`/artists/${matchingArtist.id}`);
                    } else {
                        throw "Cannot find artist"; // TODO: Make this a toast or a dialog.
                    }
                });
            }
        });

    }, [album.id, apiService, artist, router])

    return (
        <li className="mb-2 w-52 min-h-52 border-2 rounded-lg text-center p-1.5 pt-2.5 text-xs overflow-visible">
            <Image
                src={url}
                alt={`Thumbnail of cover art for ${album?.title}`}
                style={imageStyle}
                width="150"
                height="150"
            />
            <h5 className="pt-2"><FavouriteComponent albumId={album?.id} />{" " + albumTitle}</h5>
            {artist && <a className="text-decoration-line color-blue text-blue-600 cursor-pointer" onClick={goToArtist}>{artist}</a>}
            {showYear && (<p>{album.year}</p>)}
        </li>
    )
}