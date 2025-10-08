import { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export function DeleteProductModal({
  getProducts,
  isOpen,
  setIsOpen,
  tempProduct,
}) {
  const deleteModalRef = useRef(null);
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

  const handleCloseDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    modalInstance.hide();

    setIsOpen(false)
  };

  useEffect(() => {
    // 建立實例
    new Modal(deleteModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(deleteModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);
  return (
    <>
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
