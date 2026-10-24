import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StopsShell from "./StopsShell";

type Stop = {
  id: number;
  name: string;
  image_url: string | null;
  wheelchair_accessible: boolean;
  has_shelter: boolean;
  has_ticket_machine: boolean;
};

export default function StopDetail() {
  const { id } = useParams();
  const [stop, setStop] = useState<Stop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStop(null);

    fetch(`/api/v1/stops/${encodeURIComponent(id ?? "")}`)
      .then((res) => {
        if (res.status === 404 || res.status === 400) {
          throw new Error("This stop does not exist.");
        }
        if (!res.ok) throw new Error("Could not load the stop. Please try again later.");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStop(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(
          e instanceof TypeError
            ? "The server is not responding. Please try again later."
            : e.message,
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <StopsShell>
        <main className="stops-content">
          <div className="stops-status" role="status">
            <span className="stops-spinner" aria-hidden="true" />
            Loading stop...
          </div>
        </main>
      </StopsShell>
    );
  }

  if (error || !stop) {
    return (
      <StopsShell>
        <main className="stops-content">
          <Link className="stop-back-link" to="/stops">
            <span aria-hidden="true">←</span> All campus stops
          </Link>
          <div className="stops-status stops-status-error" role="alert">
            <span className="stops-status-icon" aria-hidden="true">!</span>
            <div>
              <h1>We couldn’t find that stop</h1>
              <p>{error ?? "Could not load the stop."}</p>
            </div>
          </div>
        </main>
      </StopsShell>
    );
  }

  return (
    <StopsShell>
      <main className="stops-content stop-detail-content">
        <Link className="stop-back-link" to="/stops">
          <span aria-hidden="true">←</span> All campus stops
        </Link>

        <section className="stop-detail-hero" aria-labelledby="stop-title">
          <div className="stop-detail-copy">
            <h1 id="stop-title">{stop.name}</h1>
            <a className="stop-detail-scroll" href="#stop-facilities">
              Explore facilities <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="stop-detail-image">
            {stop.image_url ? (
              <img src={stop.image_url} alt={`${stop.name} stop`} />
            ) : (
              <div className="stop-image-placeholder">
                <span aria-hidden="true">T</span>
                <p>Stop image coming soon</p>
              </div>
            )}
          </div>
        </section>

        <section
          className="stop-facilities"
          id="stop-facilities"
          aria-labelledby="facilities-title"
        >
          <div className="stop-results-heading">
            <div>
              <h2 id="facilities-title">Facilities at this stop</h2>
            </div>
            <span className="stop-facilities-count">3 features</span>
          </div>
          <ul className="stop-facility-grid">
            <li className="stop-facility-card">
              <span className="stop-facility-icon" aria-hidden="true">↗</span>
              <div>
                <h3>Step-free access</h3>
                <p>Accessible boarding and arrival</p>
              </div>
              <span
                className={`stop-facility-value ${
                  stop.wheelchair_accessible ? "is-available" : "is-unavailable"
                }`}
              >
                {stop.wheelchair_accessible ? "Available" : "Not available"}
              </span>
            </li>
            <li className="stop-facility-card">
              <span className="stop-facility-icon" aria-hidden="true">⌂</span>
              <div>
                <h3>Shelter</h3>
                <p>Cover while you wait</p>
              </div>
              <span
                className={`stop-facility-value ${
                  stop.has_shelter ? "is-available" : "is-unavailable"
                }`}
              >
                {stop.has_shelter ? "Available" : "Not available"}
              </span>
            </li>
            <li className="stop-facility-card">
              <span className="stop-facility-icon" aria-hidden="true">▣</span>
              <div>
                <h3>Ticket machine</h3>
                <p>Buy tickets at the stop</p>
              </div>
              <span
                className={`stop-facility-value ${
                  stop.has_ticket_machine ? "is-available" : "is-unavailable"
                }`}
              >
                {stop.has_ticket_machine ? "Available" : "Not available"}
              </span>
            </li>
          </ul>
        </section>
      </main>
    </StopsShell>
  );
}