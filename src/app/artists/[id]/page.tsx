
'use client'
import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";
import DiscogsService from "@/services/discogs.service";
import AlbumComponent from "@/components/album";
import Image from "next/image";
import Artist from "@/models/artist.model";
import ArtistRelease from "@/models/artist-release.model";

/**
 * A page for displaying an artist, and album releases by that artist.
 * 
 * @returns {JSX}
 */
export default function ArtistPage() {

    const params = useParams()
    const artistId = params.id

    const [albums, setAlbums]: [Array<ArtistRelease>, Function] = useState([]);
    const [artist, setArtist]: [Artist, Function] = useState(({} as Artist));


    useEffect(() => {
        DiscogsService.getArtist(artistId).then((result) => {
            if (result) {
                setArtist(result);
            }
        });
    }, [artistId]);

    useEffect(() => {
        DiscogsService.getArtistReleases(artistId).then((result) => {
            if (result && result.releases) {
                setAlbums(result.releases);
            }
        });
    }, [artistId]);

    const artistImageConfig = useMemo(() => {
        if (!artist || !artist.images) {
            return undefined;
        }
        const primaryImage = artist.images.find((image) => image.type === "primary");
        if (primaryImage) {
            return primaryImage;
        } else {
            return undefined;
        }
    }, [artist])
    const artistImageUrl = artistImageConfig ? DiscogsService.appendSecret(artistImageConfig.resource_url) : null;

    return (
        <main className="p-8">
            {artistImageUrl && <Image
                src={artistImageUrl}
                alt={`Logo for artist ${artist.name}`}
                width={artistImageConfig?.width}
                height={artistImageConfig?.width}
            />}
            <h1 className="text-4xl font-black">{artist?.name}</h1>
            <p>{artist?.profile}</p>
            <ul className="flex flex-row flex-wrap gap-8 list-none items-center sm:items-start text-center sm:text-left font-[family-name:var(--font-geist-mono)] pt-6">
                {albums.map((album: ArtistRelease) => (<AlbumComponent key={album.id} album={album} showYear={true} />))}
            </ul>
        </main>

    );
}
