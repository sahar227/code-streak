import axios from "axios";

export const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/json",
  },
});
