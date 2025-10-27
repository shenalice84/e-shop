import api from "./axios";

const checkUserLogin = async () => {
  try {
    const res = await api.post(`/api/user/check`);

    return res
  } catch (error) {
    console.error(error)
  }
};

export { checkUserLogin }