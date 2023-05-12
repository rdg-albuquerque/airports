import React from "react";
type Props = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    additionalInfo: string
};

const StatusModal = ({ setIsModalOpen, additionalInfo }: Props): JSX.Element => {
    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Disable reason</h2>
                {additionalInfo}
            </div>
        </div>
    )
}

export default StatusModal