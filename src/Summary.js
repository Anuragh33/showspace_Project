import { average } from "./App"

export function Summary({ watched }) {
  const avgImdbRating = Math.ceil(
    average(watched.map((movie) => movie.imdbRating))
  )
  const avgUserRating = Math.ceil(
    average(watched.map((movie) => movie.userRating))
  )
  const avgRuntime = Math.ceil(average(watched.map((movie) => movie.runtime)))
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}
