"use client"

import React, { createContext, useContext, useState } from 'react';



const FavouritesContext = createContext(null);
export const useFavourites = () => useContext(FavouritesContext);

/**
 * Context provider for the favourites system, so it can be used on albums from anywhere in the application.
 * 
 * @param {object} params
 * @param {JSX} children
 * @returns {JSX}
 */
const FavouritesProvider = ({ children }) => {

    const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem("favourites") || "null") || []);

    /**
     * Toggles whether an album is favourited
     * @param {string|number} albumId - The ID of the album to favourite/unfavourite 
     */
    const toggleFavourite = (albumId) => {
        setFavourites((prev) => {

            const newValue = prev.includes(albumId)
                ? prev.filter((id) => id !== albumId)
                : [...prev, albumId];

            localStorage.setItem("favourites", JSON.stringify(newValue));
            return newValue;
        });
    };

    /**
     * Check whether an album is favourited
     * @param {string|nuber} albumId - ID of the album to check 
     * @returns {boolean} 
     */
    const isFavourite = (albumId) => favourites.includes(albumId);

    return (
        <FavouritesContext.Provider value={{ isFavourite, toggleFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
};

export default FavouritesProvider;