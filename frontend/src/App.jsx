import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NewUser from "./components/NewUser";

function App() {
  return (
    <Router> {/* //wraps the entire app in a Router component, which enables routing functionality throughout the app. It listens to changes in the URL and renders the appropriate components based on the defined routes. --- IGNORE --- */}
      <Routes> {/* //acts as a container for all the different routes in the app */}
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewUser />} />
      </Routes>
    </Router>
  );
}

export default App;
