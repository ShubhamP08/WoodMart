import React, { useState, useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import { Link } from "react-router-dom";
import { db } from "../../../utils/firebaseConfig";
import { UserAuth } from "../../context/authContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

import "./ModalDetailOrder.css";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModalDetailOrder = ({ buyDetail, onClose }) => {
  const [getProductRebuy, setGetProductRebuy] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    buyDetail.map((data) => {
      return setGetProductRebuy(data.itemCheckout);
    });
  }, [buyDetail]);

  const reBuyRef = doc(db, "users", `${user?.email}`);
  const AddRebuyProduct = async (itemID) => {
    if (user?.email) {
      try {
        const reBuy = getProductRebuy.filter((data) => data.id === itemID);
        reBuy.map((data) => {
          updateDoc(reBuyRef, {
            cartProduct: arrayUnion({
              id: data.id,
              category: data.category,
              img: data.img,
              nama: data.name,
              tagline: data.tagline,
              harga: data.price,
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
      <div className="OverlayModal">
        <div className="containerDetailOrder">
          <button className="clsModalDetail" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
          <h1 style={{ textAlign: "center", marginTop: "30px" }}>
          Transaction Details
          </h1>

          <hr className="lineBreak" />

          {buyDetail.map((data) => (
            <div className="buyDetailWrap" key={data.orderid}>
              <div className="orderStatus">
                <h3>Not yet paid off</h3>

                <hr className="lineBreakDot" />

                <div className="noInvoiceNdateBuy">
                  <div className="invoice">
                    <p>No. Invoice</p>
                    <Link
                      to={`../invoice/${data.invoice.replace(/[/]/g, "-")}`}
                      target="_blank"
                    >
                      <p>{data.invoice}</p>
                    </Link>
                  </div>

                  <div className="dateBuy">
                    <p>Purchase date</p>
                    <p>{data.dateBuy}</p>
                  </div>
                </div>
              </div>
              <div className="detailProduct">
                <h3>Product Details</h3>
                {data.itemCheckout.map((list) => (
                  <div className="productHistoryList" key={list.id}>
                    <img src={list.img} alt={list.name} width={120} />
                    <div className="detailProductHistory">
                      <Link to={`../product/${list.category}/${list.id}`}>
                        <h3>{list.name}</h3>
                      </Link>
                      <p>
                        {list.qty} x &#x20B9;{numberWithCommas(list.price)}
                      </p>
                    </div>

                    <hr className="lineBreakDetail" />

                    <div className="hargaNrebuy">
                      <h3>Total Price</h3>
                      <h4>&#x20B9;{numberWithCommas(list.price * list.qty)}</h4>
                      <button
                        className="btnRebuy"
                        onClick={() => {
                          AddRebuyProduct(list.id);
                          notifyAddToCart();
                        }}
                        style={{ marginLeft: "0px" }}
                      >
                        Buy again
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {data.address.map((alamat) => (
                <div className="infoPengiriman" key={alamat.recipient}>
                  <h3>Shipping Info</h3>
                  <div className="kurir">
                    <p>Delivery Type</p>
                    <p> : {data.courier}</p>
                  </div>

                  <div className="alamat">
                    <p>Address</p>
                    <div className="detailAlamat">
                      <p> : {alamat.recipient}</p>
                      <p>{alamat.phonenumber}</p>
                      <p>
                        {alamat.address}, {alamat.city}, {alamat.Postalcode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rincianPembayaran">
                <h3>Payment details</h3>
                <div className="metodePembayaran">
                  <p>Payment method</p>
                  <p>{data.payment}</p>
                </div>

                <hr className="lineBreakDot" />

                <div className="totalHargaPembelian">
                  <p>Total Price ( {data.totalitem} Goods)</p>
                  <p>&#x20B9;{numberWithCommas(data.totalprice)}</p>
                </div>

                <div className="totalOngkir">
                  <p>Total Shipping Cost( {data.courier} )</p>
                  <p>&#x20B9;{numberWithCommas(data.shipping)}</p>
                </div>

                <hr className="lineBreakDot" />

                <div className="totalBelanja">
                  <h3>Total Spend</h3>
                  <h3>&#x20B9;{numberWithCommas(data.totalbill)}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalDetailOrder;
