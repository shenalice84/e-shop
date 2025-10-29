import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [cart, setCart] = useState({});
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const getCart = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
    } finally {
      setIsScreenLoading(false);
    }
  };

  const swiperRef = useRef(null)

  useEffect(() => {
    getCart();

    new Swiper(swiperRef.current, {
      modules: [Autoplay],
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      slidesPerView: 2,
      spaceBetween: 10,
      breakpoints: {
        767: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });

  }, []);

  const removeCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`);

      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  const removeCartItem = async (cartItem_id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/cart/${cartItem_id}`);

      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  const updateCartItem = async (cartItem_id, product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });

      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsScreenLoading(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const { message, ...user } = data;
    const userInfo = {
      data: {
        user,
        message,
      },
    };
    checkout(userInfo);
  };

  const checkout = async (data) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/order`, data);
      getCart();
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="mt-3">
          <h3 className="mt-3 mb-4">購物車</h3>
          <div className="row">
            <div className="col-md-8">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 ps-0">
                      產品名稱
                    </th>
                    <th scope="col" className="border-0">
                      數量
                    </th>
                    <th scope="col" className="border-0">
                      價錢
                    </th>
                    <th scope="col" className="border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts?.map((cartItem) => (
                    <tr key={cartItem.id} className="border-bottom border-top">
                      <th
                        scope="row"
                        className="border-0 px-0 font-weight-normal py-4"
                      >
                        <img
                          src={cartItem.product.imageUrl}
                          alt=""
                          style={{
                            width: "72px",
                            height: "72px",
                            objectFit: "cover",
                          }}
                        />
                        <p className="mb-0 fw-bold ms-3 d-inline-block">
                          {cartItem.product.title}
                        </p>
                      </th>
                      <td
                        className="border-0 align-middle"
                        style={{ maxWidth: "160px" }}
                      >
                        <div className="input-group pe-5">
                          <div className="input-group-prepend">
                            <button
                              onClick={() =>
                                updateCartItem(
                                  cartItem.id,
                                  cartItem.product.id,
                                  cartItem.qty - 1
                                )
                              }
                              className="btn btn-outline-dark border-0 py-2"
                              type="button"
                              id="button-addon1"
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control border-0 text-center my-auto shadow-none"
                            placeholder=""
                            aria-label="Example text with button addon"
                            aria-describedby="button-addon1"
                            value={cartItem.qty}
                          />
                          <div className="input-group-append">
                            <button
                              onClick={() =>
                                updateCartItem(
                                  cartItem.id,
                                  cartItem.product.id,
                                  cartItem.qty + 1
                                )
                              }
                              className="btn btn-outline-dark border-0 py-2"
                              type="button"
                              id="button-addon2"
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="border-0 align-middle">
                        <p className="mb-0 ms-auto">
                          NT {cartItem.final_total}
                        </p>
                      </td>
                      <td className="border-0 align-middle">
                        <button
                          onClick={() => removeCartItem(cartItem.id)}
                          className="btn btn-outline-dark border-0 py-2"
                          type="button"
                          id="button-addon2"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="input-group w-50 mb-3">
                <input
                  type="text"
                  className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
                  placeholder="Coupon Code"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                    type="button"
                    id="button-addon2"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border p-4 mb-4">
                <h4 className="fw-bold mb-4">訂單資訊</h4>
                <table className="table text-muted border-bottom">
                  <tbody>
                    <tr>
                      <th
                        scope="row"
                        className="border-0 px-0 pt-4 font-weight-normal"
                      >
                        小計
                      </th>
                      <td className="text-end border-0 px-0 pt-4">
                        {cart.total}
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                      >
                        付款方式
                      </th>
                      <td className="text-end border-0 px-0 pt-0 pb-4">
                        ApplePay
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-flex justify-content-between mt-4">
                  <p className="mb-0 h4 fw-bold">總計</p>
                  <p className="mb-0 h4 fw-bold">NT {cart.final_total}</p>
                </div>
                <Link to="/checkout-form" className="btn btn-dark w-100 mt-4">
                  結帳
                </Link>
              </div>
            </div>
          </div>
          <div className="my-5">
            <h3 className="fw-bold">Lorem ipsum dolor sit amet</h3>
            <div ref={swiperRef} className="swiper mt-4 mb-5">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="card border-0 mb-4 position-relative position-relative">
                    <img
                      src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                      className="card-img-top rounded-0"
                      alt="..."
                    />
                    <a href="#" className="text-dark"></a>
                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-3">
                        <a href="#">Lorem ipsum</a>
                      </h4>
                      <p className="card-text mb-0">
                        NT$1,080
                        <span className="text-muted ">
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className="text-muted mt-3"></p>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card border-0 mb-4 position-relative position-relative">
                    <img
                      src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                      className="card-img-top rounded-0"
                      alt="..."
                    />
                    <a href="#" className="text-dark"></a>
                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-3">
                        <a href="#">Lorem ipsum</a>
                      </h4>
                      <p className="card-text mb-0">
                        NT$1,080
                        <span className="text-muted ">
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className="text-muted mt-3"></p>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card border-0 mb-4 position-relative position-relative">
                    <img
                      src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                      className="card-img-top rounded-0"
                      alt="..."
                    />
                    <a href="#" className="text-dark"></a>
                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-3">
                        <a href="#">Lorem ipsum</a>
                      </h4>
                      <p className="card-text mb-0">
                        NT$1,080
                        <span className="text-muted ">
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className="text-muted mt-3"></p>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card border-0 mb-4 position-relative position-relative">
                    <img
                      src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                      className="card-img-top rounded-0"
                      alt="..."
                    />
                    <a href="#" className="text-dark"></a>
                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-3">
                        <a href="#">Lorem ipsum</a>
                      </h4>
                      <p className="card-text mb-0">
                        NT$1,080
                        <span className="text-muted ">
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className="text-muted mt-3"></p>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card border-0 mb-4 position-relative position-relative">
                    <img
                      src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                      className="card-img-top rounded-0"
                      alt="..."
                    />
                    <a href="#" className="text-dark"></a>
                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-3">
                        <a href="#">Lorem ipsum</a>
                      </h4>
                      <p className="card-text mb-0">
                        NT$1,080
                        <span className="text-muted ">
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className="text-muted mt-3"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <Loading />
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="container">
  //     <div>
  //       {cart.carts?.length > 0 && (
  //         <>
  //           <div className="text-end py-3">
  //             <button
  //               onClick={removeCart}
  //               className="btn btn-outline-danger"
  //               type="button"
  //             >
  //               清空購物車
  //             </button>
  //           </div>

  //           <table className="table align-middle">
  //             <thead>
  //               <tr>
  //                 <th></th>
  //                 <th>品名</th>
  //                 <th style={{ width: "150px" }}>數量/單位</th>
  //                 <th className="text-end">單價</th>
  //               </tr>
  //             </thead>

  //             <tbody>
  //               {cart.carts?.map((cartItem) => {
  //                 return (
  //                   <tr key={cartItem.id}>
  //                     <td>
  //                       <button
  //                         onClick={() => {
  //                           removeCartItem(cartItem.id);
  //                         }}
  //                         type="button"
  //                         className="btn btn-outline-danger btn-sm"
  //                       >
  //                         x
  //                       </button>
  //                     </td>
  //                     <td>{cartItem.product.title}</td>
  //                     <td style={{ width: "150px" }}>
  //                       <div className="d-flex align-items-center">
  //                         <div className="btn-group me-2" role="group">
  //                           <button
  //                             onClick={() => {
  //                               updateCartItem(
  //                                 cartItem.id,
  //                                 cartItem.product_id,
  //                                 cartItem.qty - 1
  //                               );
  //                             }}
  //                             type="button"
  //                             className="btn btn-outline-dark btn-sm"
  //                             disabled={cartItem.qty <= 1}
  //                           >
  //                             -
  //                           </button>
  //                           <span
  //                             className="btn border border-dark"
  //                             style={{ width: "50px", cursor: "auto" }}
  //                           >
  //                             {cartItem.qty}
  //                           </span>
  //                           <button
  //                             onClick={() => {
  //                               updateCartItem(
  //                                 cartItem.id,
  //                                 cartItem.product_id,
  //                                 cartItem.qty + 1
  //                               );
  //                             }}
  //                             type="button"
  //                             className="btn btn-outline-dark btn-sm"
  //                           >
  //                             +
  //                           </button>
  //                         </div>
  //                         <span className="input-group-text bg-transparent border-0">
  //                           {cartItem.product.unit}
  //                         </span>
  //                       </div>
  //                     </td>
  //                     <td className="text-end">{cartItem.total}</td>
  //                   </tr>
  //                 );
  //               })}
  //             </tbody>
  //             <tfoot>
  //               <tr>
  //                 <td colSpan="3" className="text-end">
  //                   總計：
  //                 </td>
  //                 <td className="text-end" style={{ width: "130px" }}></td>
  //               </tr>
  //             </tfoot>
  //           </table>
  //         </>
  //       )}
  //     </div>
  //     <div className="my-5 row justify-content-center">
  //       <form noValidate onSubmit={handleSubmit(onSubmit)} className="col-md-6">
  //         <div className="mb-3">
  //           <label htmlFor="email" className="form-label">
  //             Email
  //           </label>
  //           <input
  //             id="email"
  //             type="email"
  //             className={`form-control ${errors.email && "is-invalid"}`}
  //             placeholder="請輸入 Email"
  //             {...register("email", {
  //               required: "Email 必填",
  //               pattern: {
  //                 value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  //                 message: "Email 格式錯誤",
  //               },
  //             })}
  //           />
  //           {errors.email && (
  //             <p className="text-danger my-2">{errors.email.message}</p>
  //           )}
  //         </div>

  //         <div className="mb-3">
  //           <label htmlFor="name" className="form-label">
  //             收件人姓名
  //           </label>
  //           <input
  //             id="name"
  //             className={`form-control ${errors.name && "is-invalid"}`}
  //             placeholder="請輸入姓名"
  //             {...register("name", {
  //               required: "name 必填",
  //             })}
  //           />

  //           {errors.name && (
  //             <p className="text-danger my-2">{errors.name.message}</p>
  //           )}
  //         </div>

  //         <div className="mb-3">
  //           <label htmlFor="tel" className="form-label">
  //             收件人電話
  //           </label>
  //           <input
  //             id="tel"
  //             type="text"
  //             className={`form-control ${errors.tel && "is-invalid"}`}
  //             placeholder="請輸入電話"
  //             {...register("tel", {
  //               required: "tel 必填",
  //               pattern: {
  //                 value: /^(0[2-8]\d{7}|09\d{8})$/,
  //                 message: "Tel 格式錯誤",
  //               },
  //             })}
  //           />

  //           {errors.tel && (
  //             <p className="text-danger my-2">{errors.tel.message}</p>
  //           )}
  //         </div>

  //         <div className="mb-3">
  //           <label htmlFor="address" className="form-label">
  //             收件人地址
  //           </label>
  //           <input
  //             id="address"
  //             type="text"
  //             className={`form-control ${errors.address && "is-invalid"}`}
  //             placeholder="請輸入地址"
  //             {...register("address", {
  //               required: "address 必填",
  //             })}
  //           />

  //           {errors.address && (
  //             <p className="text-danger my-2">{errors.address.message}</p>
  //           )}
  //         </div>

  //         <div className="mb-3">
  //           <label htmlFor="message" className="form-label">
  //             留言
  //           </label>
  //           <textarea
  //             id="message"
  //             className="form-control"
  //             cols="30"
  //             rows="10"
  //             {...register("message")}
  //           ></textarea>
  //         </div>
  //         <div className="text-end">
  //           <button type="submit" className="btn btn-danger">
  //             送出訂單
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //     {isScreenLoading && (
  //       <div
  //         className="d-flex justify-content-center align-items-center"
  //         style={{
  //           position: "fixed",
  //           inset: 0,
  //           backgroundColor: "rgba(255,255,255,0.3)",
  //           zIndex: 999,
  //         }}
  //       >
  //         <Loading />
  //       </div>
  //     )}
  //   </div>
  // );
}
