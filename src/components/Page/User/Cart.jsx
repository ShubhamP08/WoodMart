import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext";
import { updateDoc, doc, onSnapshot, arrayUnion } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { numberWithCommas } from "../../../utils/numberWithCommas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";

import "./Cart.css";
import "react-toastify/dist/ReactToastify.css";
import EmptyCart from "../../assets/EmptyCart.png";
import emptyWishList from "../../assets/EmptyWishList.svg";
import { TabTitle } from "../../../utils/tabTitlePage";

const Cart = () => {
  const [cartItem, setCartItem] = useState([]);
  const [wishListItem, setWishListItem] = useState([]);
  const { user } = UserAuth();
  const navigate = useNavigate();

  let settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    pauseOnFocus: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setCartItem(doc.data()?.cartProduct);
    });
  }, [user?.email]);

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setWishListItem(doc.data()?.savedProduct);
    });
  }, [user?.email]);

  const handleDecerment = (cartId) => {
    setCartItem((cartItem) =>
      cartItem.map((item) =>
        cartId === item.id
          ? { ...item, qty: item.qty - (item.qty > 1 ? 1 : 0) }
          : item
      )
    );
  };

  const handleIncerment = (cartId) => {
    setCartItem((cartItem) =>
      cartItem.map((item) =>
        cartId === item.id
          ? { ...item, qty: item.qty + (item.qty < 10 ? 1 : 0) }
          : item
      )
    );
  };

  const productRef = doc(db, "users", `${user?.email}`);
  const removeProduct = async (itemID) => {
    try {
      const removed = cartItem.filter((item) => item.id !== itemID);
      await updateDoc(productRef, {
        cartProduct: removed,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const itemCount = Array.isArray(cartItem) ? cartItem.length : null;
  const wishListCount = Array.isArray(wishListItem)
    ? wishListItem.length
    : null;

  const totalBayar = Array.isArray(cartItem)
    ? cartItem.reduce(function (result, item) {
        return result + item.qty * item.price;
      }, 0)
    : null;

  const itemCheckout = Array.isArray(cartItem) ? cartItem : null;

  const checkout = async () => {
    if (user?.email) {
      itemCheckout.map((data) => {
        updateDoc(productRef, {
          checkoutProduct: arrayUnion({
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

  const notifyDeleteProductCart = () =>
    toast.success("Successfully removed from cart", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    TabTitle(`WoodMart | Cart (${itemCount})`);

  return (
    <React.Fragment>
      <ToastContainer style={{ fontSize: "13px" }} />
      <div className="containerCartPage">
        <div className="itemBoxWrap">
          <div className="checkboxAction">
            <div className="itemAllCheckBox">
              <h3>Cart Product</h3>
            </div>
            {/* <button>Hapus Item</button> */}
          </div>
          <div className="itemsCartUserBox">
            {itemCount === 0 ? (
              <div className="emptyCartPage">
                <img src={EmptyCart} alt="emptycartImg" width={200} />
                <p>
                  <b>Your Cart is Empty</b>
                </p>
                <p>
                  It looks like you haven't added anything to your cart yet. Choose
                  product menu to start browsing our products
                </p>
              </div>
            ) : (
              <>
                {Array.isArray(cartItem)
                  ? cartItem.map((items) => (
                      <React.Fragment key={items.id}>
                        <div className="cartItems">
                          <img src={items.img} alt="productImage" width={150} />
                          <div className="descItem">
                            <h3
                              onClick={() =>
                                navigate(
                                  `../product/${items.category}/${items.id}`
                                )
                              }
                            >
                              {items.name}
                            </h3>
                            <p>{items.tagline}</p>
                            <h4>&#x20B9;{numberWithCommas(items.price)}</h4>
                          </div>
                        </div>

                        <div className="cartAction">
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              removeProduct(items.id);
                              notifyDeleteProductCart();
                            }}
                            className="iconDeleteProduct"
                          >
                            <FontAwesomeIcon icon={faTrashCan} size="xl" />
                          </div>

                          <div className="quantitiyInput">
                            <button
                              className="btnInput"
                              type="button"
                              onClick={() => handleDecerment(items.id)}
                            >
                              -
                            </button>

                            <input
                              className="inputNum"
                              type="text"
                              value={items.qty}
                              readOnly
                            />

                            <button
                              className="btnInput"
                              type="button"
                              onClick={() => handleIncerment(items.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <hr className="itemLineBreak" />
                      </React.Fragment>
                    ))
                  : null}
              </>
            )}
          </div>

          <div className="ringkasanBelanjaMobile">
            <h2>Shopping Summary</h2>
            <div className="totalprice">
              <h4>Total Price ( {itemCount} Product )</h4>
              <h4>&#x20B9; {numberWithCommas(totalBayar)}</h4>
            </div>
            <div className="btnAction">
              {itemCount === 0 ? (
                <button className="btnBeliDisable">
                  Checkout ( {itemCount} )
                </button>
              ) : (
                <button
                  className="btnBeli"
                  onClick={() => {
                    checkout();
                    navigate("/checkout");
                  }}
                >
                  Checkout ( {itemCount} )
                </button>
              )}
            </div>
          </div>

          <div className="wishListCollection">
            <h2>Make your Product Wish List come true</h2>
            <hr className="itemLineBreak" />
            <div className="wishListItem">
              {wishListCount === 0 ? (
                <div className="emptyWishList">
                  <img src={emptyWishList} alt="emptywishlist" width={300} />
                  <h2>
                    It looks like you haven't added the product to your wishlist yet
                  </h2>
                  <p>
                    Enter the product menu and select the product you want
                  </p>
                </div>
              ) : (
                <Slider {...settings}>
                  {Array.isArray(wishListItem)
                    ? wishListItem.map((items) => (
                        <React.Fragment key={items.id}>
                          <div
                            className="wishListItemWraper"
                            onClick={() =>
                              navigate(
                                `../product/${items.category}/${items.id}`
                              )
                            }
                          >
                            <img src={items.img} alt={items.name} width={100} />
                            <div className="descWishlist">
                              <h3>{items.name}</h3>
                              <p>{items.tagline}</p>
                              <h4>&#x20B9;{numberWithCommas(items.price)}</h4>
                            </div>
                          </div>
                        </React.Fragment>
                      ))
                    : null}
                </Slider>
              )}
            </div>
          </div>
        </div>

        <div className="ringkasanBelanja">
          <h2>Shopping Summary</h2>
          <div className="totalprice">
            <h4>Total Price ( {itemCount} Product )</h4>
            <h4>&#x20B9; {numberWithCommas(totalBayar)}</h4>
          </div>
          <div className="btnAction">
            {itemCount === 0 ? (
              <button className="btnBeliDisable">
                Checkout ( {itemCount} )
              </button>
            ) : (
              <button
                className="btnBeli"
                onClick={() => {
                  checkout();
                  navigate("/checkout");
                }}
              >
                Checkout ( {itemCount} )
              </button>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Cart;
