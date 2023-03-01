import React, { useState, useEffect } from "react";
import { UserAuth } from "../../context/authContext";
import { db } from "../../../utils/firebaseConfig";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import CountdownTimer from "./CountdownTimer";
import { TabTitle } from "../../../utils/tabTitlePage";

import "./CheckoutSuccess.css";

const CheckoutSuccess = () => {
  const [order, setOrder] = useState([]);
  const { user } = UserAuth();
  let { orderid } = useParams();
  TabTitle("WoodMart | Checkout Success");

  const orderRef = collection(db, "users", `${user?.email}`, "orderHistory");
  const getOrder = query(orderRef, where("orderid", "==", `${orderid}`));
  useEffect(() => {
    onSnapshot(getOrder, (doc) => {
      const userOrder = [];
      doc.forEach((data) => {
        userOrder.push(data.data());
        setOrder(userOrder);
      });
    });
  }, [user?.email]);

  const dataOrder = Array.isArray(order) ? order : null;

  return (
    <div className="ContainerCheckoutSuccess">
      <h2>Checkout Successful</h2>
      <div className="countDownTimer">
        <h3>Immediately Make Payments In Time</h3>
        <h1>
          <CountdownTimer duration={5*  60 * 1000} />
        </h1>
        <p>This Checkout page is only a standalone project and does not post any items</p>
      </div>

      {dataOrder.map((data) => (
        <div className="transfer" key={data.payment}>
          <h3>Transfer To Account Number {data.payment}:</h3>
          <label>WoodMart Project</label>
          <div className="norek">
            {/* <img src={mandiri} alt="logobank" width={100} /> */}
            <h4>0000-0000-0000</h4>
          </div>
          <p>Copy Account Number</p>
        </div>
      ))}

      <hr className="line" />

      <div className="jumlahPembayaran">
        <h3>Amount To Be Paid</h3>
        {dataOrder.map((datas) => (
          <h2 key={datas.orderid}>
            &#x20B9; {numberWithCommas(datas.totalprice)}
          </h2>
        ))}
      </div>

      <div className="goToHistory">
        <Link to="../orderList">
          <p>View Purchase History</p>
        </Link>
      </div>

      <div className="infoStatement">
        <p>
          Purchase will <b>automatic</b> cancelled if you do not make a payment of more than<b>specified time</b> after process
          Checkout was successful
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
