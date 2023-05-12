import React, { useRef, useState } from "react";
import type Airport from "../../types/airport";
import { useGlobal } from "../../hooks/useGlobal";
import DisableModal from "../DisableModal";
import StatusModal from "../StatusModal";

type Props = {
  airport: Airport;
};

const TableRow = ({ airport }: Props): JSX.Element => {
  const { updateAirport } = useGlobal();
  const isFetching = useRef(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleStatusClick = () => {
    if (airport.active) return

    setIsStatusModalOpen(true)
  }

  const handleDisableEnableClick = async () => {
    if (airport.active) {
      setIsDisableModalOpen(true)
      return
    }
    
    if (isFetching.current) return;
    try {
      isFetching.current = true
      await updateAirport(airport);
      isFetching.current = false
    } catch (error: any) {
      isFetching.current = true
      console.error(error.message);
    }
}

  return (
    <>
      <tr>
        <td>{airport.iata}</td>
        <td>{airport.city}</td>
        <td>{airport.lat}</td>
        <td>{airport.lon}</td>
        <td>{airport.state}</td>
        <td><span className={airport.active ? 'td-status-available' : 'td-status-unavailable'} onClick={handleStatusClick}>{airport.active ? "Available" : "Unavailable"}</span></td>
        <td>
          <button onClick={handleDisableEnableClick} className="btn-primary">
            {airport.active ? "Disable" : "Enable"}
          </button>
        </td>
      </tr>
      {isDisableModalOpen && <DisableModal airport={airport} setIsModalOpen={setIsDisableModalOpen} />}
      {isStatusModalOpen && <StatusModal additionalInfo={airport.info} setIsModalOpen={setIsStatusModalOpen} />}
    </>
  );
};

export default TableRow;
