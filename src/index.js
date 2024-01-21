import React from "react"
import ReactDOM from "react-dom/client"
import StartRating from "./Star-Rating"
import Expander from "./Expander"
// import "./index.css"
// import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <StartRating
      maxRating={10}
      messages={["Terrible", "Not Bad", "Okay", "Good", "Awesome"]}
    /> */}
    <Expander />
  </React.StrictMode>
)
