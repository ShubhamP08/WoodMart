import React, { useState, useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../../utils/databaseapi";
import { numberWithCommas } from "../../../../../utils/numberWithCommas";
import { useNavigate } from "react-router-dom";

import "./ModalAddToCart.css";

const ModalAddToCart = ({ open, onClose, thisProduct }) => {
  const [moreProduct, setMoreProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_URL + "products").then((res) => setMoreProduct(res.data));
  }, []);

  const randomMoreProduct = moreProduct.sort(() => 0.5 - Math.random());

  if (!open) return null;

  return (
    <div className="overlayAddToCart">
      <div className="containerModalAddToCart">
        <button className="clsModalOrder" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} size="xl" />
        </button>
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        Successfully Added
        </h2>

        <div className="thisProduct">
          <img src={thisProduct.picture} alt={thisProduct.name} width={100} />
          <div className="procutName">
            <h3>{thisProduct.name}</h3>
          </div>
          <Link to="/cart">
            <button className="goToCart">View Cart</button>
          </Link>
        </div>

        <h2>Our Other Products</h2>

        <div className="morePorductWrap">
          {randomMoreProduct.slice(0, 3).map((list) => (
            <div className="productMoreList" key={list.id}>
              <a onClick={() => {navigate( `../../product/${list.category.id}/${list.id}`); onClose()}}>
                <img src={list.picture} alt={list.name} />
                <p>{list.category.name}</p>
                <h1>{list.name}</h1>
                <p>{list.tagline}</p>
                <h2>&#x20B9;{numberWithCommas(list.price)}</h2>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalAddToCart;
