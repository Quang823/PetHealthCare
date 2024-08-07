import React from 'react';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';

function Nav({ Toggle }) {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <i className="navbar-brand bi bi-justify-left fs-4" onClick={Toggle}></i>
      <button
        className="navbar-toggler d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavId"
        aria-controls="collapsibleNavId"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="bi bi-justify"></i>
      </button>
      <div className="collapse navbar-collapse" id="collapsibleNavId">
        <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
          <li className="nav-item dropdown">


          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;