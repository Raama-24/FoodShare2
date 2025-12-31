import axios from "axios";

const API_URL = import.meta.env.VITE_ADMIN_API;

export const verifyUser = async (uid, verified = true) => {
  const res = await axios.post(`${API_URL}/verifyUser`, { uid, verified });
  return res.data;
};

export const setAdmin = async (uid) => {
  const res = await axios.post(`${API_URL}/setAdmin`, { uid });
  return res.data;
};

export const revokeAdmin = async (uid) => {
  const res = await axios.post(`${API_URL}/revokeAdmin`, { uid });
  return res.data;
};
