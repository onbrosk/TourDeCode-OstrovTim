import React from 'react'

import StopDetail from "./StopDetail";
import { Routes, Route } from "react-router-dom";
import StopList from "./StopList";
import { useEffect, useState } from "react";
import { getHealth } from "./api";
import DisplayMembers from './components/DisplayMembers';
import DisplayTeams from './components/DisplayTeams';

function Home() {
  const [healthStatus, setHealthStatus] = useState("Loading...");

  useEffect(() => {
    getHealth()
      .then(({ status }) => setHealthStatus(status === "ok" ? "OK" : "ERROR"))
      .catch((error: unknown) => {
        console.error("Failed to check API health:", error);
        setHealthStatus("ERROR");
      });
  }, []);

  return (
    <main>
      <h1>Think different Academy</h1>
      <DisplayTeams />
      <DisplayMembers />
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stops" element={<StopList />} />
      <Route path="/stops/:id" element={<StopDetail />} />
    </Routes>
  );
}

export default App;