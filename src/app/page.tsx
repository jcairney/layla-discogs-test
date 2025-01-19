
'use client'
import { useEffect, useMemo, useState } from "react";
import AlbumComponent from "@/components/album";
import DiscogsService from "@/services/discogs.service";
import SearchRelease from "@/models/search-release.model";

/**
 * The main page for searching albums
 * 
 * @returns {JSX}
 */
export default function Home() {

  const [albums, setAlbums] = useState([]);
  const [filters, setFilters] = useState({ year: "2024", genre: "", country: "Canada" });
  const showYear = filters.year != "";

  useEffect(() => {
    DiscogsService.searchReleases(`year=${filters.year}&genre=${filters.genre}&country=${filters.country}`).then((result) => {
      if (result && result.results)
        setAlbums(result.results);
    });
  }, [filters]);

  const listOfYears = useMemo(() => {
    const currentYear = (new Date()).getFullYear();
    const years = [];
    for (let i = 1900; i <= currentYear; i++) {
      years.push("" + i);
    }
    return years;
  }, [])

  const getFilterChangeHandler = (propName: string) => {
    return (event) => {
      setFilters((prev) => ({ ...prev, [propName]: event.target.value }));
    };
  };


  return (
    <main className="">
      <h1 className="text-4xl font-black">Albums</h1>
      <search className="bg-slate-200 p-2">
        Year:
        <select value={filters.year} onChange={getFilterChangeHandler("year")} className="border-2 rounded-sm mx-2">
          <option value="">{"<unselected>"}</option>
          {listOfYears.map((year) => (<option key={year} value={year}>{year}</option>))}
        </select>
        Genre:
        <input value={filters.genre} onChange={getFilterChangeHandler("genre")} className="border-2 rounded-sm mx-2" />
        Country:
        <input value={filters.country} onChange={getFilterChangeHandler("country")} className="border-2 rounded-sm mx-2" />
      </search>
      <ul className="flex flex-row flex-wrap gap-8 list-none items-center sm:items-start text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        {albums.map((album: SearchRelease) => (<AlbumComponent
          key={album.id}
          album={album}
          showYear={showYear}
        />))}
      </ul>
    </main>

  );
}
