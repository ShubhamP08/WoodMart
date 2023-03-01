import React, { useEffect, useState, useRef } from "react";
import { UserAuth } from "../../context/authContext";
import { db } from "../../../utils/firebaseConfig";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import ReactToPrint from "react-to-print";
import { useParams } from "react-router-dom";

import "./Invoice.css";
import Logo from "../../assets/woodmart.png";
import { TabTitle } from "../../../utils/tabTitlePage";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const { user } = UserAuth();
  let { invoice } = useParams();
  const getInvoice = invoice.split("-").join("/");
  const componentRef = useRef();
  TabTitle(`WoodMart | ${getInvoice}`);


  const invoiceDataRef = collection(db, "users", `${user?.email}`, "orderHistory");
  const getInvoiceData = query(invoiceDataRef, where("invoice", "==", getInvoice));
  useEffect(() => {
    onSnapshot(getInvoiceData, (doc) => {
      const dataInvoice = [];
      doc.forEach((data) => {
        dataInvoice.push(data.data());
        setInvoiceData(dataInvoice);
      });
    });
  }, [user?.email]);
  const BuyInvoice = Array.isArray(invoiceData) ? invoiceData : null;

  return (
    <React.Fragment>
      <div className="navbarInvoice">
        <ReactToPrint
          trigger={() => {
            return <button>Print Invoices</button>;
          }}
          content={() => componentRef.current}
          documentTitle="Invoice Purchase"
        />
      </div>
      {BuyInvoice.map((data) => (
        <div className="containerInvoice" ref={componentRef}>
          <div className="logoNinvoice">
            <img src={Logo} alt="logo" width={200}/>
            <div className="invoiceProduct">
              <h5>INVOICE</h5>
              <p>{data.invoice}</p>
            </div>
          </div>

          <div className="peneribitan">
            <div className="diterbikanAtasNama">
              <h5>PUBLISHED IN THE NAME</h5>
              <p>
              Seller:<b>WoodMart</b>
              </p>
            </div>
            {data.address.map((alamat) => (
              <div className="detailPembeli">
                <h5>FOR</h5>
                <p>Buyer : {alamat.recipient}</p>
                <p>Purchase date : {data.dateBuy}</p>
                <div className="alamatPenerima">
                  <p>
                   Shipping address : {alamat.recipient}, {alamat.phonenumber},{" "}
                    {alamat.address}, {alamat.city}, {alamat.Postalcode}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <span>
            <hr />
          </span>

          <div className="tableHeader">
            <div className="tableHeaderNamaProduk">
              <h5>PRODUCT INFO </h5>
            </div>
            <div className="jumlahBarang">
              <h5> QUANTITY </h5>
            </div>
            <div className="hargaSatuan">
              <h5> UNIT PRICE </h5>
            </div>
            <div className="totalHargaBelanja">
              <h5> TOTAL PRICE </h5>
            </div>
          </div>

          <span>
            <hr />
          </span>

          {data.itemCheckout.map((product) => (
            <div className="productBuyList">
              <div className="tableHeaderNamaProduk">
                <h5>{product.name}</h5>
              </div>
              <div className="jumlahBarang">
                <p>{product.qty}</p>
              </div>
              <div className="hargaSatuan">
                <p>&#x20B9; {numberWithCommas(product.price)}</p>
              </div>
              <div className="totalHargaBelanja">
                <p>&#x20B9; {numberWithCommas(product.price * product.qty)}</p>
              </div>
            </div>
          ))}

          <span>
            <hr className="lineBreak" />
          </span>

          <div className="pembayaran">
            <div className="totalHargaOrder">
              <h5>TOTAL PRICE ({data.totalitem} GOODS)</h5>
              <h5>&#x20B9; {numberWithCommas(data.totalprice)}</h5>
            </div>

            <div className="totalOngkirOrder">
              <p>Total Shipping Cost</p>
              <p>&#x20B9; {numberWithCommas(data.shipping)}</p>
            </div>

            <hr className="lineBreak" />

            <div className="totalBelanjaOrder">
              <h5>TOTAL EXPENDITURES</h5>
              <h5>&#x20B9; {numberWithCommas(data.totalbill)}</h5>
            </div>
            <h2>NOT YET PAID OFF</h2>
          </div>

          <span>
            <hr className="lineBreak" />
          </span>

          <div className="kurirNbank">
            <div className="kurirOrder">
              <p>Courier :</p>
              <h5>{data.courier}</h5>
            </div>
            <div className="pembayaranOrder">
              <p>Payment method</p>
              <h5>{data.payment}</h5>
            </div>
          </div>

          <span>
            <hr className="lineBreak" />
          </span>

          <div className="statement">
            <p>
              This invoice is only a dummy for a project and does not send any goods.
            </p>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default Invoice;
