import { useEffect, useState } from "react"
import StarRating from "./Star-Rating"
import { KEY, Loading } from "./App"

export function MovieDetails({ selectedId, onClosingMovie, onWatched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const {
    Title: title,
    Poster: poster,
    Year: year,
    Released: released,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    BoxOffice: boxoffice,
    Genre: genre,
    imdbRating,
    Plot,
    Language,
  } = movie

  function handleAddWatchedMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      runtime: Number(runtime.split(" ").at(0)),
      year,
      title,
      poster,
      imdbRating: Number(imdbRating),
    }
    onWatched(newWatchedMovie)
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true)
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        )
        const data = await res.json()
        setMovie(data)
        setIsLoading(false)
      }
      getMovieDetails()
    },
    [selectedId]
  )

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClosingMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${movie} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {year} &bull; {runtime}
              </p>
              <p>Genre: {genre}</p>
              <span>⭐️ {imdbRating} IMDB Rating</span>
              <section>
                <div className="rating">
                  {" "}
                  <StarRating color={"var(--color-primary)"} size={24} />
                  <button className="btn-add" onClick={handleAddWatchedMovie}>
                    Marked as Watched
                  </button>{" "}
                </div>
                {/* <p>Boxoffice: {boxoffice}</p> */}
                <p>Director: {director}</p>
                <p>Actors: {actors}</p>
                <em>Plot: {Plot}</em>
                <p>Languages: {Language}</p>
              </section>
            </div>
          </header>
        </>
      )}
    </div>
  )
}
