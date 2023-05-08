import { createContext, useContext, useRef, useState } from "react"
import Airport from "../types/airport";

export type ActiveFilterType = 'all' | 'true' | 'false'

type UseGlobalType = {
  airports: Airport[]
  setAirports: React.Dispatch<React.SetStateAction<Airport[]>>
  activeFilter: ActiveFilterType
  setActiveFilter: React.Dispatch<React.SetStateAction<ActiveFilterType>>
  getAirports: () => Promise<void>
  updateAirport: (airport: Airport) => Promise<void>
}

const GlobalContext = createContext<UseGlobalType | null>(null)

function GlobalProvider({ children }: {children: React.ReactNode}) {
  const value = useGlobalProvider();
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

const useGlobalProvider = () : UseGlobalType => {
  const authorization = "Basic " + window.btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`)

  const [airports, setAirports] = useState<Airport[]>([])
  const [activeFilter, setActiveFilter] = useState<ActiveFilterType>("all")
  const isFetching = useRef(false)

  const getAirports = async () => {
    if (isFetching.current) return

    isFetching.current = true
    const response = await fetch(
      "https://flights-api.herokuapp.com/getAirports",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
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

  const updateAirport = async (airport: Airport) => {
    const response = await fetch(
      `https://flights-api.herokuapp.com/airportStatus/${airport.iata}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
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

  return {
    airports,
    setAirports,
    activeFilter,
    setActiveFilter,
    getAirports,
    updateAirport
  }
}

const useGlobal = () => {
  const context = useContext(GlobalContext)

  return context as UseGlobalType;
}

export {useGlobal, GlobalProvider}