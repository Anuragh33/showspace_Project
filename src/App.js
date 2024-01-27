import { useEffect, useRef, useState } from "react"
import { MovieDetails } from "./MovieDetails"
import { Summary } from "./Summary"
import { Box } from "./Box"
import { MovieList } from "./MovieList"
import { WatchedList } from "./WatchedList"
import { useMovies } from "./useMovies"

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

export const KEY = "52f56d3e"

export default function App() {
  const [query, setQuery] = useState("")

  const [selectedId, setSelectedID] = useState(null)

  const { movies, error, isLoading } = useMovies(query, handleCloseMovie)

  const [watched, setWatched] = useState(() => {
    const storedItem = localStorage.getItem("watched")
    return JSON.parse(storedItem)
  })

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

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
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
  const inputEl = useRef(null)

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputEl) return
      if (e.key === "Enter" || e.key === "NumpadEnter") {
        inputEl.current.focus()
        setQuery("")
      }
    }

    document.addEventListener("keydown", callback)
    return () => document.removeEventListener("keydown", callback)
  }, [setQuery])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search Movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
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
