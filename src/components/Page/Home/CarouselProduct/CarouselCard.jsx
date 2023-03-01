import React from "react";
import { numberWithCommas } from "../../../../utils/numberWithCommas";
import { useNavigate } from "react-router-dom";

import "../CarouselProduct/CarouselCard.css";

const CarouselCard = ({ menu }) => {
  const navigate = useNavigate();

  return (
    <div className="CarouselCard">
      <a onClick={() => navigate(`product/${menu.category.id}/${menu.id}`)}>
        <img src={menu.picture} alt="products" />
        <p>{menu.category.name}</p>
        <h1>{menu.name}</h1>
        <p>{menu.tagline}</p>
        <h2>&#x20B9;{numberWithCommas(menu.price)}</h2>
      </a>
    </div>
  );
};

export default CarouselCard;
