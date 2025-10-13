import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

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

  useEffect(() => {
    getCart();
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
    <div className="container">
      <div>
        {cart.carts?.length > 0 && (
          <>
            <div className="text-end py-3">
              <button
                onClick={removeCart}
                className="btn btn-outline-danger"
                type="button"
              >
                清空購物車
              </button>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>

              <tbody>
                {cart.carts?.map((cartItem) => {
                  return (
                    <tr key={cartItem.id}>
                      <td>
                        <button
                          onClick={() => {
                            removeCartItem(cartItem.id);
                          }}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          x
                        </button>
                      </td>
                      <td>{cartItem.product.title}</td>
                      <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              onClick={() => {
                                updateCartItem(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty - 1
                                );
                              }}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              disabled={cartItem.qty <= 1}
                            >
                              -
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: "50px", cursor: "auto" }}
                            >
                              {cartItem.qty}
                            </span>
                            <button
                              onClick={() => {
                                updateCartItem(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty + 1
                                );
                              }}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cartItem.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cartItem.total}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計：
                  </td>
                  <td className="text-end" style={{ width: "130px" }}></td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
      <div className="my-5 row justify-content-center">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              placeholder="請輸入 Email"
              {...register("email", {
                required: "Email 必填",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email 格式錯誤",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger my-2">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              className={`form-control ${errors.name && "is-invalid"}`}
              placeholder="請輸入姓名"
              {...register("name", {
                required: "name 必填",
              })}
            />

            {errors.name && (
              <p className="text-danger my-2">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="text"
              className={`form-control ${errors.tel && "is-invalid"}`}
              placeholder="請輸入電話"
              {...register("tel", {
                required: "tel 必填",
                pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: "Tel 格式錯誤",
                },
              })}
            />

            {errors.tel && (
              <p className="text-danger my-2">{errors.tel.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className={`form-control ${errors.address && "is-invalid"}`}
              placeholder="請輸入地址"
              {...register("address", {
                required: "address 必填",
              })}
            />

            {errors.address && (
              <p className="text-danger my-2">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
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
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
    </div>
  );
}
