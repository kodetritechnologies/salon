import axios from "axios";
import Cookies from "js-cookie";
export default function BasicProvider() {
  const token = Cookies.get("adminToken");
  function getHeaders(data: any) {
    let headers: any = {};
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { withCredentials: true, headers: headers };
  }

  const getMethod = async (endpoint: any) => {
    const config: any = getHeaders({});
    try {
      const response = await axios.get(`${endpoint}`, config);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  };

  const postMethod = async (endpoint: any, data: any) => {
    const config = getHeaders(data);
    try {
      const response = await axios.post(`${endpoint}`, data, config);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  };

  const patchMethod = async (endpoint: any, data: any) => {
    const config = getHeaders(data);
    try {
      const response = await axios.patch(`${endpoint}`, data, config);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  };

  const putMethod = async (endpoint: any, data: any) => {
    const config = getHeaders(data);
    try {
      const response = await axios.put(`${endpoint}`, data, config);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  };

  const deleteMethod = async (endpoint: any, data?: any) => {
    const config = getHeaders(data);
    try {
      const response = await axios.delete(`${endpoint}`, config);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  };

  return {
    getMethod,
    postMethod,
    putMethod,
    patchMethod,
    deleteMethod,
  };
}
