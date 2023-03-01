import React from "react";
import { Link } from "react-router-dom";

import "./BackPageModal.css";

const BackPageModal = ({ onClose, onOk }) => {
  return (
    <div className="overlayModal">
      <div className="containerModalBackConfirm">
        <div className="warningBack">
          <h3>Are you sure you want to go to the previous page?</h3>
          <h2>Changes made to Item Checkout will not be saved</h2>
        </div>

        <div className="btnModalBack">
          <Link to="../cart">
            <button className="btnOK" onClick={onOk}>
             Yes return to the previous page
            </button>
          </Link>
          <button onClick={onClose}>Cancel and stay on this page</button>
        </div>
      </div>
    </div>
  );
};

export default BackPageModal;
