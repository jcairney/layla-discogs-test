import Image from "next/image";
import { Album } from "../models/album.model";
import JSONPService from "../services/http.service";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFavourites } from "./favourites.context-provider";

export default function FavouriteComponent({ albumId }: { albumId: number }) {

    const { toggleFavourite, isFavourite } = useFavourites();
    const favourite = isFavourite(albumId);

    const toggleFavouriteForAlbum = useCallback(() => {
        toggleFavourite(albumId);
    }, [albumId])

    return (
        <a className="color-red text-red-600 cursor-pointer" title={favourite ? "Unfavourite" : "Favourite"} onClick={toggleFavouriteForAlbum}>{favourite ? "❤︎" : "♡"}</a>
    )
}