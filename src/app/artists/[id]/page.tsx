
'use client'
import { useCallback, useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";
import JSONPService from "@/services/http.service";
import { Album } from "@/models/album.model";
import AlbumComponent from "@/components/album";
import Image from "next/image";

export default function ArtistPage() {

    const params = useParams()
    const artistId = params.id

    const [albums, setAlbums] = useState([]);
    const [artist, setArtist] = useState({});

    const apiService = useMemo(() => new JSONPService(), []);

    useEffect(() => {
        apiService.request(`/artists/${artistId}`).then((result) => {
            console.log(result);
            debugger;
            if (result) {
                setArtist(result);
            }
        });
    }, [apiService, artistId]);

    useEffect(() => {
        apiService.request(`/artists/${artistId}/releases`).then((result) => {
            console.log(result);
            debugger;
            if (result && result.releases) {
                setAlbums(result.releases);
            }
        });
    }, [apiService, artistId]);

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
    const artistImageUrl = artistImageConfig ? JSONPService.appendSecret(artistImageConfig.resource_url) : null;

    return (
        <main className="p-8">
            <Image
                src={artistImageUrl}
                alt={`Logo for artist ${artist.name}`}
                width={artistImageConfig?.width}
                height={artistImageConfig?.width}
            />
            <h1 className="text-4xl font-black">{artist?.name}</h1>
            <p>{artist?.profile}</p>
            <ul className="flex flex-row flex-wrap gap-8 list-none items-center sm:items-start text-center sm:text-left font-[family-name:var(--font-geist-mono)] pt-6">
                {albums.map((album: Album) => (<AlbumComponent key={album.id} album={album} apiService={apiService} showYear={true} />))}
            </ul>
        </main>

    );
}
