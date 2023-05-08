import React from "react"
import Airport from "../../types/airport"

type Props = {
  airport: Airport
  getAirports: () => void
}

const TableRow = ({ airport, getAirports }: Props): JSX.Element => {
  const handleBtnClick = async () => {
    const response = await fetch(
      `https://flights-api.herokuapp.com/airportStatus/${airport.iata}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            window.btoa(
              `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`
            ),
        },
        body: JSON.stringify({ active: !airport.active }),
      }
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // Get updated list after update some airport
    getAirports()
  }

  return (
    <tr>
      <td>{airport.iata}</td>
      <td>{airport.city}</td>
      <td>{airport.lat}</td>
      <td>{airport.lon}</td>
      <td>{airport.state}</td>
      <td>{airport.active ? "Available" : "Unavailable"}</td>
      <td>
        <button onClick={handleBtnClick} className="row-btn">
          {airport.active ? "Disable" : "Enable"}
        </button>
      </td>
    </tr>
  )
}

export default TableRow
