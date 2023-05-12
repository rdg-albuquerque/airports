import React, {useRef, useState} from "react";
import { useGlobal } from "../../hooks/useGlobal";
import Airport from "../../types/airport";

type Props = {
    airport: Airport;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const DisableModal = ({ airport, setIsModalOpen }: Props): JSX.Element => {
    const { updateAirport } = useGlobal();
    const isFetching = useRef(false);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    const closeModal = () => setIsModalOpen(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFetching.current) return;

        try {
            isFetching.current = true
            await updateAirport(airport, additionalInfo);
            closeModal()
            isFetching.current = false
        } catch (error: any) {
            isFetching.current = true
            console.error(error.message);
        }
    }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h1 className="disable-modal-title">Disable Airport {airport.iata}</h1>
                <form onSubmit={handleSubmit}>
                    <textarea required value={additionalInfo} onChange={(e) => setAdditionalInfo(e.currentTarget.value)} placeholder="Inform the reason for disabling it" />
                    <button type="submit" className="btn-primary form-btn">Disable</button>
                </form>
            </div>
        </div>
    )
}

export default DisableModal