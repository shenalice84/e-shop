import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  "$1"
);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token
  }
})

export default api