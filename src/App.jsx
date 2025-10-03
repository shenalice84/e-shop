import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);

  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  };

  const handleInputChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/admin/signin`, account);
      setIsAuth(true);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`; // 存token到cookie
      axios.defaults.headers.common["Authorization"] = token;
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(false);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const checkUserLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (error) {}
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin();
  }, []);

  const [modalMode, setModalMode] = useState(null);
  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });

    new Modal(deleteModalRef.current, {
      backdrop: false,
    });
  }, []);

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    setTempProduct(product || defaultModalState);
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleOpenDeleteModal = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    modalInstance.show();
  };

  const handleCloseDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    modalInstance.hide();
  };

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  const handleImageChange = (e, index) => {
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = e.target.value;

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;

    setTempProduct({
      ...tempProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ""];

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`
      );

      getProducts();
      handleCloseDeleteModal();
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async () => {
    const apiCall = modalMode === "create" ? createProduct : updateProduct;

    await apiCall();
    getProducts();
    handleCloseProductModal();
  };

  return (
    <>
      {isAuth ? (
        <div className="container mt-5">
          <div className="row mt-5">
            <div className="col">
              {/* <button onClick={checkUserLogin} className="btn btn-primary">check user auth</button> */}
              <div className="d-flex justify-content-between">
                <h2>product list</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleOpenProductModal("create");
                  }}
                >
                  建立新的產品
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">name</th>
                    <th scope="col">original price</th>
                    <th scope="col">price</th>
                    <th scope="col">isactive</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr key={product.id}>
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>
                          {product.is_enabled ? (
                            <span className="text-success">啟用</span>
                          ) : (
                            <span>未啟用</span>
                          )}
                        </td>
                        <td>
                          {/* <button
                            onClick={() => {
                              setTempProduct(product);
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            detail
                          </button> */}
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                handleOpenProductModal("edit", product);
                              }}
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                handleOpenDeleteModal(product);
                              }}
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* <div className="col-6">
              <h2>product detail</h2>
              {tempProduct.title ? (
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge text-bg-primary">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      product description: {tempProduct.description}
                    </p>
                    <p className="card-text">
                      product content: {tempProduct.content}
                    </p>
                    <p>
                      <del>${tempProduct.origin_price}</del>/$
                      {tempProduct.price}
                    </p>
                    <h5 className="card-title">more pic</h5>
                    {tempProduct.imagesUrl?.map((imageUrl) => {
                      return (
                        <div key={imageUrl} className="my-3">
                          <img src={imageUrl} className="card-img" alt="..." />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                "select a product"
              )}
            </div> */}
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                value={account.username}
                name="username"
                onChange={handleInputChange}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={account.password}
                name="password"
                onChange={handleInputChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary">
              登入
            </button>
          </form>
        </div>
      )}

      {/* add & edit Modal */}
      <div
        id="productModal"
        className="modal"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ref={productModalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalMode === "edit" ? "編輯商品" : "新增商品"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseProductModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="btn-group w-100">
                    {tempProduct.imagesUrl.length < 5 &&
                      tempProduct.imagesUrl[
                        tempProduct.imagesUrl.length - 1
                      ] !== "" && (
                        <button
                          onClick={handleAddImage}
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          新增圖片
                        </button>
                      )}

                    {tempProduct.imagesUrl.length > 1 && (
                      <button
                        onClick={handleRemoveImage}
                        className="btn btn-outline-danger btn-sm w-100"
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleUpdateProduct}
                type="submit"
                className="btn btn-primary"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* delete modal */}
      <div
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ref={deleteModalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseDeleteModal}
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCloseDeleteModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={deleteProduct}
                type="button"
                className="btn btn-danger"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
