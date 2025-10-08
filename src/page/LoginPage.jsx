import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function LoginPage({ setIsAuth }) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

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
  return (
    <>
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
    </>
  );
}
