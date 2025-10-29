import { createBrowserRouter } from "react-router-dom";
import { FrontLayout } from "../layout/FrontLayout";
import ProductsPage from "../page/ProductsPage";
import HomePage from "../page/HomePage";
import ProductDetailPage from "../page/ProductDetailPage";
import CartPage from "../page/CartPage";
import NotFound from "../page/NotFound";
import ProductPage from "../page/ProductPage";
import LoginPage from "../page/LoginPage";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../layout/AdminLayout";
import CheckoutFormPage from "../page/CheckoutFormPage";
import CheckoutPaymentPage from "../page/CheckoutPaymentPage";
import CheckoutSuccessPage from "../page/CheckoutSuccessPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout-form",
        element: <CheckoutFormPage />,
      },
      {
        path: "checkout-payment",
        element: <CheckoutPaymentPage />,
      },
      {
        path: "checkout-success",
        element: <CheckoutSuccessPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <ProductPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
