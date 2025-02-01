import React from "react";
import "./style.css"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children } : Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}></button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;