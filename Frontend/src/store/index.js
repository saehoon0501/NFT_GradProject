import { atom } from "recoil";

export const mintedState = atom({
  key: "mintedState",
  default: false,
});

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
});

export const changeImageState = atom({
  key: "changeImageState",
  default: false,
});

export const isWritingPost = atom({
  key: "isWritingPostState",
  default: false,
});

export const socketState = atom({
  key: "socketState",
  default: null,
});
