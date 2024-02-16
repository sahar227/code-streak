import axios from "axios";

export const codeStreakApi = axios.create({
  //   baseURL: "172.26.224.1:3000/api",
  baseURL: "10.0.2.2:3000/api",
});
