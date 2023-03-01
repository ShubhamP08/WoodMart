import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext";
import { updateDoc, doc, onSnapshot, arrayRemove, collection, addDoc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import { v4 as uuid } from "uuid";
import AddressModal from "./AddressModal";
import ModalEditAddress from "./ModalEditAddress";
import BackPageModal from "./BackPageModal";

import "./CheckOut.css";
import addAddresImg from "../../assets/addAddress.svg";
import Logo from "../../assets/woodmart.png";
import Mandiri from "../../assets/pp.png";
import BCA from "../../assets/paytm.png";
import BRI from "../../assets/Gpay2.png";
import { TabTitle } from "../../../utils/tabTitlePage";

const CheckOut = () => {
  const [itemCheckout, setItemCheckout] = useState([]);
  const [itemCart, setItemCart] = useState([]);
  const [address, setAddress] = useState([]);
  const [shipping, setshipping] = useState(0);
  const [jeniscourier, setJeniscourier] = useState("");
  const [bank, setBank] = useState("");
  const [modalAddress, setModalAddress] = useState(false);
  const [modalEditAddress, setModalEditAddress] = useState(false);
  const [modalConfirmBack, setModalConfirmBack] = useState(false);
  const { user } = UserAuth();
  const unique_id = uuid().slice(0, 8);
  const navigate = useNavigate();
  TabTitle("WoodMart | Checkout");

  const courier = [
    {
      jenis: "Regular",
      shipping: 10000,
    },
    {
      jenis: "Express",
      shipping: 20000,
    },
    {
      jenis: "Cargo",
      shipping: 15000,
    },
  ];

  useEffect(() => {
    window.history.pushState(null, "", document.URL);
    window.addEventListener("popstate", () => {
      setModalConfirmBack(true);
    });
  }, []);

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setItemCheckout(doc.data()?.checkoutProduct);
    });
  }, [user?.email]);

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setItemCart(doc.data()?.cartProduct);
    });
  }, [user?.email]);

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setAddress(doc.data()?.address);
    });
  }, [user?.email]);

  const totalprice = Array.isArray(itemCheckout)
    ? itemCheckout.reduce(function (result, item) {
        return result + item.qty * item.price;
      }, 0)
    : null;

  const itemRef = doc(db, "users", `${user?.email}`);
  const checkoutDone = async () => {
    if (user?.email) {
      await addDoc(collection(db, "users", `${user?.email}`, "orderHistory"), {
        orderid: unique_id,
        dateBuy: date,
        invoice: "INV/" + `${current.getFullYear()}/` + invoiceNumber,
        totalitem: itemCount,
        totalprice: totalprice,
        payment: bank,
        shipping: shipping,
        courier: jeniscourier,
        totalbill: totalTagihan,
        itemCheckout,
        address,
      });

      itemCheckout.map((data) => {
        updateDoc(itemRef, {
          checkoutProduct: arrayRemove({
            id: data.id,
            category: data.category,
            img: data.img,
            name: data.name,
            tagline: data.tagline,
            price: data.price,
            qty: data.qty,
          }),
        });
      });
      

      itemCart.map((data) => {
        updateDoc(itemRef, {
          cartProduct: arrayRemove({
            id: data.id,
            category: data.category,
            img: data.img,
            name: data.name,
            tagline: data.tagline,
            price: data.price,
            qty: data.qty,
          }),
        });
      });
    }
    navigate(`../success/${unique_id}`);
  };

  const onUserBack = () => {
    if (user?.email) {
      itemCheckout.map((data) => {
        updateDoc(itemRef, {
          checkoutProduct: arrayRemove({
            id: data.id,
            category: data.category,
            img: data.img,
            name: data.name,
            tagline: data.tagline,
            price: data.price,
            qty: data.qty,
          }),
        });
      });
    }
  };

  const totalTagihan = parseInt(shipping) + totalprice;
  const itemCount = Array.isArray(itemCheckout) ? itemCheckout.length : null;
  const addressCount = Array.isArray(address) ? address.length : null;
  const userAddress = Array.isArray(address) ? address : null;

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()} ${current.getHours()}:${current.getMinutes()} IST`;

  let minNumber = 1000;
  let maxNumber = 9999;
  const invoiceNumber = Math.round(
    Math.random() * (maxNumber - minNumber) + minNumber
  );

  return (
    <React.Fragment>
      <AddressModal
        open={modalAddress}
        onClose={() => setModalAddress(false)}
      />

      <ModalEditAddress 
      open={modalEditAddress}
      onClose={() => setModalEditAddress(false)}
      address={userAddress}
      />

      {modalConfirmBack && (
        <BackPageModal
          onClose={() => setModalConfirmBack(false)}
          onOk={onUserBack}
        />
      )}

      <div className="Navigation">
        <img src={Logo} alt="LogoWoodMart" width={150}/>
      </div>

      <div className="checkOutContainer">
        <div className="checkoutWrap">
          <div className="alamatUser">
            <h3>Shipping address</h3>
            <hr className="itemLineBreak" />
            {addressCount === 0 ? (
              <div className="addressEmpty">
                <img src={addAddresImg} alt="addaddress" width={200} />
                <h4>It looks like your shipping address is empty</h4>
                <h4>Add Shipping Address To Continue</h4>
                <p onClick={() => setModalAddress(true)}>
                  Add Shipping Address
                </p>
              </div>
            ) : Array.isArray(address) ? (
              address.slice(0, 1).map((data) => (
                <div className="dataAlamat" key={data.recipient}>
                  <h4>
                    {data.recipient} ( {data.label} )
                  </h4>
                  <p>{data.phonenumber}</p>
                  <p>
                    {data.address}, {data.city}, {data.Postalcode}
                  </p>
                  <a onClick={() => setModalEditAddress(true)} style={{cursor: "pointer"}}>Change Address</a>
                </div>
              ))
            ) : null}
            <hr className="itemLineBreak" />
          </div>

          <div className="itemCheckout">
            <h3>Item Checkout</h3>
            {Array.isArray(itemCheckout)
              ? itemCheckout.map((item) => (
                  <div className="checkoutItems" key={item.id}>
                    <img src={item.img} alt={item.name} width={150} />
                    <div className="descItemCheckout">
                      <h3>{item.name}</h3>
                      <p>{item.tagline}</p>
                      <h4>&#x20B9;{numberWithCommas(item.price)}</h4>
                      <p>{item.qty} Goods</p>
                    </div>
                  </div>
                ))
              : null}

            <div className="courierPengiriman">
              <div className="selectcourier">
                <label>Choose a delivery courier</label>
                <select
                  name="courier"
                  /* value={shipping} */
                  onChange={(e) => {
                    setshipping(e.target.value);
                    setJeniscourier(
                      e.target.selectedOptions[0].getAttribute("courier")
                    );
                  }}
                >
                  <option value="" selected disabled>
                  Select Courier
                  </option>
                  {courier.map((data) => (
                    <option
                      value={data.shipping}
                      courier={data.jenis}
                      key={data.jenis}
                    >
                      {data.jenis} &#x20B9;{numberWithCommas(data.shipping)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p>Select Payment Method</p>
            <div className="metodepayment">
              <div className="bank">
                <div className="mandiri">
                  <img src={Mandiri} alt="mandiri" width={150} />
                  <label htmlFor="mandiri">Phonepay</label>
                  <input
                    type="radio"
                    id="mandiri"
                    name="contact"
                    value="Phonepay"
                    onChange={(e) => setBank(e.target.value)}
                  />
                </div>

                <div className="bca">
                  <img src={BCA} alt="bca" width={100} />
                  <label htmlFor="bca">Paytm</label>
                  <input
                    type="radio"
                    id="bca"
                    name="contact"
                    value="Paytm"
                    onChange={(e) => setBank(e.target.value)}
                  />
                </div>

                <div className="bri">
                  <img src={BRI} alt="bri" width={100} />
                  <label htmlFor="bri">GPay</label>
                  <input
                    type="radio"
                    id="bri"
                    name="contact"
                    value="Gpay"
                    onChange={(e) => setBank(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ringkasanCheckout">
          <h3>Shopping Summary</h3>
          <div className="totalCheckout">
            <div className="totalBayarItem">
              <h4>Total price ( {itemCount} Goods )</h4>
              <h4>&#x20B9; {numberWithCommas(totalprice)}</h4>
            </div>
            <div className="totalBayarshipping">
              <h4>Total Shipping Cost {jeniscourier}</h4>
              <h4>&#x20B9; {numberWithCommas(shipping)}</h4>
            </div>
            <div className="totalTagihan">
              <h4>Total bill</h4>
              <h4>&#x20B9; {numberWithCommas(totalTagihan)}</h4>
            </div>
          </div>
          <div className="btnCheckout">
            {addressCount === 0 || bank === "" || shipping === 0 ? (
              <button className="btnDisableCheckout">
                Complete the checkout procedure
              </button>
            ) : (
              <button
                type="button"
                className="btnBayar"
                onClick={checkoutDone}
              >
                Pay
              </button>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CheckOut;
