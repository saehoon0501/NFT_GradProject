import { atom } from "recoil";

export const mintedState = atom({
  key: "mintedState",
  default: false,
});

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
});
