import axios from "axios";

export const githubAPi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/json",
  },
});
