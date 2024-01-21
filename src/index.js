import React from "react"
import ReactDOM from "react-dom/client"
import StartRating from "./Star-Rating"
// import "./index.css"
// import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StartRating
      maxRating={5}
      messages={["Terrible", "Not Bad", "Okay", "Good", "Awesome"]}
    />
  </React.StrictMode>
)
