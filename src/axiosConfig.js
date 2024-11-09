// src/axiosConfig.js
import axios from 'axios';
const instance = axios.create({
    baseURL: "https://backendtest-5r9m.onrender.com/",    //backend

    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export default instance;
  
