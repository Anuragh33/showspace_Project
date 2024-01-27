import { useEffect, useState } from "react"
import { MovieDetails } from "./MovieDetails"
import { Summary } from "./Summary"
import { Box } from "./Box"
import { MovieList } from "./MovieList"
import { WatchedList } from "./WatchedList"

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
]

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
]

export const KEY = "52f56d3e"

export default function App() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedId, setSelectedID] = useState(null)

  function handleMovieId(id) {
    setSelectedID(selectedId === id ? null : id)
  }

  function handleCloseMovie() {
    setSelectedID(null)
  }

  function handleDeletewatchedMovies(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  function handleMovieWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  useEffect(
    function () {
      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true)
          setError("")
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          )
          if (!res.ok)
            throw new Error("Someting went wrong while fetching movies")

          const data = await res.json()
          //console.log(data.Search)

          if (data.Response === "False")
            throw new Error("Movie/TV-Show not found.")
          setMovies(data.Search)
          setError("")
        } catch (err) {
          //console.error(err.message)
          if (err.name !== "AbortError") {
            setError(err.message)
          }
        } finally {
          setIsLoading(false)
        }
      }
      if (query.length <= 2) {
        setMovies([])
        setError("")
        return
      }
      handleCloseMovie()
      fetchMovies()

      return function () {
        controller.abort()
      }
    },
    [query]
  )

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <Summary watched={watched} />
              <WatchedList watched={watched} />{" "}
            </>
          }
        /> */}

        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleMovieId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClosingMovie={handleCloseMovie}
              onWatched={handleMovieWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                watched={watched}
                onDelete={handleDeletewatchedMovies}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}

export function Loading() {
  return <p className="loader">Loading....</p>
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️</span>
      {message}
    </p>
  )
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>showSpace</h1>
    </div>
  )
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search Movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main({ children }) {
  return <main className="main">{children}</main>
}
