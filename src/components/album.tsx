import Image from "next/image";
import DiscogsService from "../services/discogs.service";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import FavouriteComponent from "./favourite";
import ReleaseBase from "@/models/release-base.model";
import SearchArtist from "@/models/search-artist.model";
import SearchRelease from "@/models/search-release.model";
import ArtistRelease from "@/models/artist-release.model";

const imageStyle = {
    display: 'inline',
}

export default function AlbumComponent({ album, showYear = false }: { album: ReleaseBase, showYear: boolean }) {

    const router = useRouter();

    const url = DiscogsService.appendSecret(album.thumb) || null;
    // /database/search?type=release has artist name spliced into the album name
    let [artist, albumTitle] = (album.title || " - ").split(" - ");
    // for data coming from /artists/{id}/releases
    if (!albumTitle) {
        albumTitle = artist;
        if ((album as ArtistRelease).artist) {
            artist = (album as ArtistRelease).artist;
        } else {
            artist = "";
        }
    }

    const goToArtist = useCallback(() => {
        DiscogsService.searchArtists(artist).then((result) => {

            // Releases returned by the /database/search endpoint do not include artist ID.  
            // We wouldn't even need a click handler if artist ID was there on the album.  We would use Next's <Link> instead of <a>
            // ALSO, the https://api.discogs.com/releases/{id} endpoint does not support JSONP, or we could get artist ID by querying the full album entry.
            // So we are doing a search of artist by name, then doing an artist releases query on each artist ID returned from the first search,
            // and checking the releases by those artists to find the album we just clicked artist on, proving that was the right artist.
            // Once we've identified the correct artist, we can navigate to the artist route, supplying the correct artist ID.
            if (result && Array.isArray(result.results)) {
                const artistReleaseQueries = [];
                const artistsBeingChecked: Array<SearchArtist> = [];
                for (const artistResult of result.results) {
                    if (artistResult.title === artist) {
                        artistsBeingChecked.push(artistResult)
                        artistReleaseQueries.push(DiscogsService.getArtistReleases(artistResult.id));
                    }
                }
                Promise.all(artistReleaseQueries).then((responses) => {
                    let matchingArtist;
                    responses.forEach((response, index: number) => {
                        if (response && Array.isArray(response.releases)) {
                            for (const release of response.releases) {
                                if (release.id === album.id || release.id === (album as SearchRelease).master_id) {
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

    }, [album, artist, router])

    return (
        <li className="mb-2 w-52 min-h-52 border-2 rounded-lg text-center p-1.5 pt-2.5 text-xs overflow-visible">
            {url ? <Image
                src={url}
                alt={`Thumbnail of cover art for ${album?.title}`}
                style={imageStyle}
                width="150"
                height="150"
            /> : <div className="h-36 w-36 bg-slate-200 inline-block leading-10">No thumbnail</div>}
            <h5 className="pt-2"><FavouriteComponent albumId={album?.id} />{" " + albumTitle}</h5>
            {artist && <a className="text-decoration-line color-blue text-blue-600 cursor-pointer" onClick={goToArtist}>{artist}</a>}
            {showYear && (<p>{album.year}</p>)}
        </li>
    )
}