import React, { useRef } from "react";
import type Airport from "../../types/airport";
import { useGlobal } from "../../hooks/useGlobal";

type Props = {
  airport: Airport;
};

const TableRow = ({ airport }: Props): JSX.Element => {
  const { updateAirport } = useGlobal();
  const isFetching = useRef(false);


  const handleBtnClick = async () => {
    if (isFetching.current) return;

    try {
      isFetching.current = true
      await updateAirport(airport);
      isFetching.current = false
    } catch (error: any) {
      isFetching.current = true
      console.error(error.message);
    }
  };

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
  );
};

export default TableRow;
