import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
import { Pagination } from "../components/Pagination";
import { ProductModal } from "../components/ProductModal";
import { DeleteProductModal } from "../components/DeleteProductModal";

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

export function ProductPage() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [modalMode, setModalMode] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    setTempProduct(product || defaultModalState);
    setIsProductModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true)
  };

  const [pageInfo, setPageInfo] = useState({});
  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row mt-5">
          <div className="col">
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
          <Pagination handlePageChange={handlePageChange} pageInfo={pageInfo} />
        </div>
      </div>

      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        getProducts={getProducts}
      />
      <DeleteProductModal
        tempProduct={tempProduct}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
        getProducts={getProducts}
      />
    </>
  );
}
