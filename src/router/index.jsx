import { createBrowserRouter } from "react-router-dom";
import { FrontLayout } from "../layout/FrontLayout";
import ProductsPage from "../page/ProductsPage";
import { HomePage } from "../page/HomePage";
import ProductDetailPage from "../page/ProductDetailPage";
import CartPage from "../page/CartPage";
import NotFound from "../page/NotFound";

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
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
