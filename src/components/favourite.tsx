import Image from "next/image";
import { Album } from "../models/search-release.model";
import DiscogsService from "../services/discogs.service";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFavourites } from "./favourites.context-provider";

/**
 * A compmonent for displaying and toggling whether an album is a favourite.
 * 
 * @param {object} params
 * @param {number} albumId - The ID of the album of which to display/toggle favourite status 
 * @returns {JSX} 
 */
export default function FavouriteComponent({ albumId }: { albumId: number }) {

    const { toggleFavourite, isFavourite } = useFavourites();
    const favourite = isFavourite(albumId);

    const toggleFavouriteForAlbum = useCallback(() => {
        toggleFavourite(albumId);
    }, [albumId, toggleFavourite])

    return (
        <a className="color-red text-red-600 cursor-pointer" title={favourite ? "Unfavourite" : "Favourite"} onClick={toggleFavouriteForAlbum}>{favourite ? "❤︎" : "♡"}</a>
    )
}