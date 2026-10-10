import React from 'react'

import { useEffect, useState } from "react";
import { getHealth } from "./api";
import DisplayMembers from './components/DisplayMembers';
import DisplayTeams from './components/DisplayTeams';

function App() {
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

export default App;