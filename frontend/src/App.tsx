import React from 'react'

import { useEffect, useState } from "react";
import { getHealth } from "./api";

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
      <p>Status: {healthStatus}</p>
    </main>
  );
}

export default App;