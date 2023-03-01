import React, { useState, useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import { Link } from "react-router-dom";
import { db } from "../../../utils/firebaseConfig";
import { UserAuth } from "../../context/authContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

import "./ModalRebuy.css";
import "react-toastify/dist/ReactToastify.css";

const ModalRebuy = ({ productRebuy, onClose }) => {
  const [itemProductRebuy, setItemProductRebuy] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    productRebuy.map((list) => {
      return setItemProductRebuy(list.itemCheckout);
    });
  }, [productRebuy]);

  const rebuyProductRef = doc(db, "users", `${user?.email}`);
  const RebuyProduct = async (itemID) => {
    if (user?.email) {
      try {
        const getIdProduct = itemProductRebuy.filter((data) => data.id === itemID);
        getIdProduct.map((data) => {
          updateDoc(rebuyProductRef, {
            cartProduct: arrayUnion({
              id: data.id,
              category: data.category,
              img: data.img,
              name: data.name,
              tagline: data.tagline,
              price: data.price,
              qty: 1,
            }),
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const notifyAddToCart = () =>
    toast.success("Successfully Added to cart", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <React.Fragment>
      <ToastContainer style={{ fontSize: "13px" }} />
      <div className="overlayModalRebuy">
        <div className="containerModalRebuy">
          <button className="clsModalRebuy" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
          <h3 style={{ textAlign: "center" }}>Buy Back our Products</h3>
          <div className="listProductRebuy">
            {productRebuy.map((data) =>
              data.itemCheckout.map((list) => (
                <div className="productRebuy" key={list.id}>
                  <img src={list.img} alt={list.name} width={150} />
                  <div className="detailProductRebuy">
                    <Link to={`../product/${list.category}/${list.id}`}>
                      <p>{list.name}</p>
                    </Link>
                    <h5>{numberWithCommas(list.price)}</h5>
                  </div>
                  <button
                    className="btnRebuyProduct"
                    onClick={() => {
                      RebuyProduct(list.id);
                      notifyAddToCart();
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalRebuy;
