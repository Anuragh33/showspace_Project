import { useEffect, useState } from "react"
import StarRating from "./Star-Rating"
import { KEY, Loading } from "./App"

export function MovieDetails({
  selectedId,
  onClosingMovie,
  onWatched,
  watched,
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState("")

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)

  const watcheduUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating
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
      userRating,
    }
    onWatched(newWatchedMovie)
    onClosingMovie()
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

  useEffect(() => {
    localStorage.getItem("watched", JSON.stringify(watched))
  }, [watched])

  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onClosingMovie()
        }
      }
      document.addEventListener("keydown", callBack)
      return function () {
        document.removeEventListener("keydown", callBack)
      }
    },
    [onClosingMovie]
  )

  useEffect(
    function () {
      if (!title) return
      document.title = `${title}`

      return function () {
        document.title = "showSpace"
      }
    },
    [title]
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
                {!isWatched ? (
                  <div className="rating">
                    {" "}
                    <StarRating
                      color={"var(--color-primary)"}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button
                        className="btn-add"
                        onClick={handleAddWatchedMovie}
                      >
                        Marked as Watched
                      </button>
                    )}
                  </div>
                ) : (
                  <p>You rated this movie with {watcheduUserRating} Stars</p>
                )}

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
