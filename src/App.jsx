import { useState } from "react";

import LoginPage from "./page/LoginPage";
import { ProductPage } from "./page/ProductPage";
import ShoppingPage from "./page/ShoppingPage"
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  // const checkUserLogin = async () => {
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/user/check`);
  //     setIsAuth(true);
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   const token = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
  //     "$1"
  //   );
  //   axios.defaults.headers.common["Authorization"] = token;
  //   checkUserLogin();
  // }, []);

  const addCartItem = async(product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    // <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth}/>}</>
    <ShoppingPage></ShoppingPage>
  );
}

export default App;
