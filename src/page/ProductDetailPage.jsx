import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";
import { Autoplay } from "swiper/modules";
import Swiper from "swiper";
import "swiper/css";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const { id: product_id } = useParams();

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch (error) {}
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

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-7">
            <div
              id="carouselExampleControls"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={product.imageUrl}
                    className="d-block w-100"
                    alt={product.title}
                  />
                </div>
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleControls"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleControls"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div className="col-md-5">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-white px-0 mb-0 py-3">
                <li className="breadcrumb-item">
                  <Link className="text-muted" to="/">
                    首頁
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link className="text-muted" to="/products">
                    產品列表
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  產品資訊
                </li>
              </ol>
            </nav>
            <h2 className="fw-bold h1 mb-1">{product.title}</h2>
            <p className="mb-0 text-muted text-end">
              <del>NT {product.origin_price}</del>
            </p>
            <p className="h4 fw-bold text-end">NT {product.price}</p>
            <div className="row align-items-center">
              <div className="col-6">
                <div className="input-group my-3 bg-light rounded">
                  <div className="input-group-prepend">
                    <button
                      onClick={() => {
                        setQtySelect(qtySelect - 1);
                      }}
                      className="btn btn-outline-dark border-0 py-2"
                      type="button"
                      id="button-addon1"
                      disabled={qtySelect === 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control border-0 text-center my-auto shadow-none bg-light"
                    placeholder=""
                    aria-label="Example text with button addon"
                    aria-describedby="button-addon1"
                    value={qtySelect}
                  />
                  <div className="input-group-append">
                    <button
                      onClick={() => {
                        setQtySelect(qtySelect + 1);
                      }}
                      className="btn btn-outline-dark border-0 py-2"
                      type="button"
                      id="button-addon2"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <button
                  onClick={() => addCartItem(product.id, qtySelect)}
                  type="button"
                  className="text-nowrap btn btn-dark w-100 py-2"
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row my-5">
          <div className="col-md-4">
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et
            </p>
          </div>
          <div className="col-md-3">
            <p className="text-muted">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor
            </p>
          </div>
        </div>
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
  );

  // return (
  //   <>
  //     <div className="container mt-5">
  //       <div className="row">
  //         <div className="col-6">
  //           <img
  //             className="img-fluid"
  //             src={product.imageUrl}
  //             alt={product.title}
  //           />
  //         </div>
  //         <div className="col-6">
  //           <div className="d-flex align-items-center gap-2">
  //             <h2>{product.title}</h2>
  //             <span className="badge text-bg-success">{product.category}</span>
  //           </div>
  //           <p className="mb-3">{product.description}</p>
  //           <p className="mb-3">{product.content}</p>
  //           <h5 className="mb-3">NT$ {product.price}</h5>
  //           <div className="input-group align-items-center w-75">
  //             <select
  //               value={qtySelect}
  //               onChange={(e) => setQtySelect(e.target.value)}
  //               id="qtySelect"
  //               className="form-select"
  //             >
  //               {Array.from({ length: 10 }).map((_, index) => (
  //                 <option key={index} value={index + 1}>
  //                   {index + 1}
  //                 </option>
  //               ))}
  //             </select>
  //             <button
  //               disabled={isLoading}
  //               onClick={() => {
  //                 addCartItem(product_id, qtySelect)
  //               }}
  //               type="button" className="btn btn-primary d-flex align-items-center gap-2">
  //               <div>加入購物車</div>
  //               {isLoading && <Loading />}
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
