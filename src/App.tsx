import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import airplaneIcon from "./images/icons8-airplane-take-off-100.png"
import "./App.css"
import type Airport from "./types/airport"
import TableRow from "./components/TableRow"

function App() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [activeFilter, setActiveFilter] = useState("all")

  const isFetching = useRef(false)

  const getAirports = async () => {
    if (isFetching.current) return

    isFetching.current = true
    const response = await fetch(
      "https://flights-api.herokuapp.com/getAirports",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            window.btoa(
              `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`
            ),
        },
      }
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data: Airport[] = await response.json()
    isFetching.current = false

    // Sorted alphabetically
    const airports = data.sort((a, b) => a.iata.localeCompare(b.iata))

    setAirports(airports)
  }

  const handleFilterChange = (event: ChangeEvent) => {
    setActiveFilter((event.target as HTMLSelectElement).value)
  }

  useEffect(() => {
    try {
      getAirports()
    } catch (error: any) {
      throw new Error(error)
    }
  }, [])

  let filteredAirports: Airport[] = []

  if (airports.length) {
    filteredAirports =
      activeFilter === "all"
        ? airports
        : airports.filter(
            (airport) => airport.active === (activeFilter === "true")
          )
  }

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
                return (
                  <TableRow
                    key={index}
                    airport={airport}
                    getAirports={getAirports}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default App
