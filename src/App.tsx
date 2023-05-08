import React, { ChangeEvent, useEffect } from "react";
import "./App.css";

import airplaneIcon from "./images/icons8-airplane-take-off-100.png";

import TableRow from "./components/TableRow";

import { useGlobal } from "./hooks/useGlobal";

import type Airport from "./types/airport";
import type { ActiveFilterType } from "./hooks/useGlobal";

function App() {
  const { getAirports, airports, activeFilter, setActiveFilter } = useGlobal();

  useEffect(() => {
    try {
      getAirports();
    } catch (error: any) {
      console.error(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (event: ChangeEvent) => {
    setActiveFilter(
      (event.target as HTMLSelectElement).value as ActiveFilterType
    );
  };

  const filteredAirports: Airport[] =
    activeFilter === "all"
      ? airports
      : airports.filter(
          (airport) => airport.active === (activeFilter === "true")
        );

  return (
    <div className="App">
      <section className="container">
        <img src={airplaneIcon} alt="airplane" />
        <h1 className="title">Search Airports</h1>
        <label className="statusFilterLabel" htmlFor="statusFilter">
          Filter by status:
        </label>
        <select
          className="statusFilter"
          id="statusFilter"
          value={activeFilter}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <div className="airports-table-wrapper">
          <table className="airports-table">
            <thead>
              <tr>
                <th>IATA</th>
                <th>City</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAirports.map((airport, index) => {
                return <TableRow key={index} airport={airport} />;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
