import axios from 'axios';

const API_URL = 'http://localhost:5000'; // replace with deployed backend URL

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
