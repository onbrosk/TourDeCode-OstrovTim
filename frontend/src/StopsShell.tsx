import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type StopsShellProps = {
  children: ReactNode;
};

export default function StopsShell({ children }: StopsShellProps) {
  return (
    <div className="stops-experience">
      <header className="stops-header">
        <div className="stops-header-inner">
          <Link className="stops-brand" to="/" aria-label="Think different Academy home">
            <img src="/brand/tda-logo.png" alt="Think different Academy" />
            <span>Campus transit</span>
          </Link>
          <nav aria-label="Main navigation">
            <Link className="stops-nav-link" to="/stops">
              Stops
              <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="stops-footer">
        <span>Think different Academy</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
