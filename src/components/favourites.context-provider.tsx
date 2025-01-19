"use client"

import React, { createContext, useContext, useState } from 'react';

const FavouritesContext = createContext(null);

export const useFavourites = () => useContext(FavouritesContext);

const FavouritesProvider = ({ children }) => {

    const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem("favourites") || "null") || []);

    const toggleFavourite = (albumId) => {
        setFavourites((prev) => {

            const newValue = prev.includes(albumId)
                ? prev.filter((id) => id !== albumId)
                : [...prev, albumId];

            localStorage.setItem("favourites", JSON.stringify(newValue));
            return newValue;
        });
    };

    const isFavourite = (albumId) => favourites.includes(albumId);



    return (
        <FavouritesContext.Provider value={{ isFavourite, toggleFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
};

export default FavouritesProvider;