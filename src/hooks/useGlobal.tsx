import { createContext, useContext, useRef, useState } from "react";
import Airport from "../types/airport";

export type ActiveFilterType = "all" | "true" | "false";

type UseGlobalType = {
  airports: Airport[];
  setAirports: React.Dispatch<React.SetStateAction<Airport[]>>;
  activeFilter: ActiveFilterType;
  setActiveFilter: React.Dispatch<React.SetStateAction<ActiveFilterType>>;
  getAirports: () => Promise<void>;
  updateAirport: (airport: Airport, additionalInfo?: string) => Promise<void>;
};

const GlobalContext = createContext<UseGlobalType | null>(null);

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const value = useGlobalProvider();
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}

const useGlobalProvider = (): UseGlobalType => {
  const apiBaseUrl = 'https://flights-api.herokuapp.com'
  const authorization =
    "Basic " +
    window.btoa(
      `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`
    );

  const [airports, setAirports] = useState<Airport[]>([]);
  const [activeFilter, setActiveFilter] = useState<ActiveFilterType>("all");
  const isFetching = useRef(false);

  const getAirports = async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    const response = await fetch(
      `${apiBaseUrl}/getAirports`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      isFetching.current = false;
      throw new Error(response.statusText);
    }

    const data: Airport[] = await response.json();
    isFetching.current = false;

    // Sorted alphabetically
    const airports = data.sort((a, b) => a.iata.localeCompare(b.iata));

    setAirports(airports);
  };

  const updateAirport = async (airport: Airport, additionalInfo?: string) => {
    const response = await fetch(
      `${apiBaseUrl}/airportStatus/${airport.iata}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify({ active: !airport.active, info: additionalInfo }),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // Get updated list after update some airport
    getAirports();
  };

  return {
    airports,
    setAirports,
    activeFilter,
    setActiveFilter,
    getAirports,
    updateAirport,
  };
};

const useGlobal = () => {
  const context = useContext(GlobalContext);

  return context as UseGlobalType;
};

export { useGlobal, GlobalProvider };
