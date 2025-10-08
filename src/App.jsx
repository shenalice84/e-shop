import { useState } from "react";

import LoginPage from "./page/LoginPage";
import { ProductPage } from "./page/ProductPage";

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

  return (
    <>{isAuth ? <ProductPage /> : <LoginPage setIsAuth={setIsAuth}/>}</>
  );
}

export default App;
