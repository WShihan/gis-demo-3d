import Cookies from "js-cookie";
const tokenKey = "token";

export function getToken() {
  return Cookies.get(tokenKey);
}

export function setToken(tk) {
  Cookies.set(tokenKey, tk, { expires: 0.1 });
}

export function removeToken() {
  Cookies.remove(tokenKey);
}
