import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const dispatch = useDispatch();

  const [wishList, setWishList] = useState(() => {
    const initWishList = localStorage.getItem('wishList') ? JSON.parse(localStorage.getItem('wishList')) : {}

    return initWishList
  })

  const toggleWishLIstItem = (product_id) => {
    const newWishList = {
      ...wishList,
      [product_id]: !wishList[product_id]
    }

    localStorage.setItem('wishList', JSON.stringify(newWishList))
    setWishList(newWishList)
  }

  // 此種撰寫方式可以很快的進行篩選，適合產品較不多的情況
  const categories = [
    "全部",
    ...new Set(allProducts.map((product) => product.category)),
  ];
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "全部") return product;

    return product.category === selectedCategory;
  });

  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAllProducts = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
        setAllProducts(res.data.products);

        dispatch(
          pushMessage({
            text: "新增產品成功",
            status: "success",
          })
        );
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsScreenLoading(false);
      }
    };
    getAllProducts();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(
          // 適合產品多、分類也多的情況
          `${BASE_URL}/api/${API_PATH}/products?category=${
            selectedCategory === "全部" ? "" : selectedCategory
          }`
        );
        setProducts(res.data.products);

        dispatch(
          pushMessage({
            text: "新增產品成功",
            status: "success",
          })
        );
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProducts();
  }, [selectedCategory]);

  return (
    <div className="container-fluid">
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ minHeight: "400px" }}
      >
        <div
          className="position-absolute"
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)",
            backgroundPosition: "center center",
            opacity: 0.1,
          }}
        ></div>
        <h2 className="fw-bold">Lorem ipsum.</h2>
      </div>
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="row">
          <div className="col-md-4">
            <div
              className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3"
              id="accordionExample"
            >
              <div className="card border-0">
                <div
                  className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                  id="headingOne"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">分類</h4>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
                <div
                  id="collapseOne"
                  className="collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="card-body py-0">
                    <ul className="list-unstyled">
                      {categories.map((category) => (
                        <li key={category}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            type="button"
                            className="btn py-2 d-block text-muted"
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-md-6">
                  <div className="card border-0 mb-4 position-relative position-relative">
                    <img
                      src={product.imageUrl}
                      className="card-img-top rounded-0"
                      alt={product.title}
                    />
                    <button
                      onClick={() => toggleWishLIstItem(product.id)}
                      type="button"
                      className="text-dark">
                      <i
                        className={`${wishList[product.id] ? "fas" : "far"} fa-heart position-absolute`}
                        style={{ right: "16px", top: "16px" }}
                      ></i>
                    </button>
                    <div className="card-body p-0">
                      <h4 className="mb-0 mt-3">
                        <Link to={`/product/${product.id}`}>
                          {product.title}
                        </Link>
                      </h4>
                      <p className="card-text mb-0">
                        NT {product.price}
                        <span className="text-muted mx-2">
                          <del>NT {product.origin_price}</del>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <nav className="d-flex justify-content-center">
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
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
  //   <>
  //     <div className="container">
  //       <table className="table align-middle">
  //         <thead>
  //           <tr>
  //             <th>圖片</th>
  //             <th>商品名稱</th>
  //             <th>價格</th>
  //             <th></th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {products.map((product) => (
  //             <tr key={product.id}>
  //               <td style={{ width: "200px" }}>
  //                 <img
  //                   className="img-fluid"
  //                   src={product.imageUrl}
  //                   alt={product.title}
  //                 />
  //               </td>
  //               <td>{product.title}</td>
  //               <td>
  //                 <del className="h6">原價 {product.origin_price} 元</del>
  //                 <div className="h5">特價 {product.origin_price}元</div>
  //               </td>
  //               <td>
  //                 <div className="btn-group btn-group-sm">
  //                   <Link
  //                     to={`/product/${product.id}`}
  //                     className="btn btn-outline-secondary">
  //                     查看更多
  //                   </Link>
  //                   <button
  //                     onClick={() => {
  //                       addCartItem(product.id, 1);
  //                     }}
  //                     type="button"
  //                     className="btn btn-outline-danger d-flex align-items-center gap-2"
  //                     disabled={isLoading}
  //                   >
  //                     <div>加到購物車</div>
  //                     {isLoading && <Loading />}
  //                   </button>
  //                 </div>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

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
  //   </>
  // );
}
