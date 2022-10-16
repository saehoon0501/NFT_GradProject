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

export const showPopUpState = atom({
  key: "showPopUpState",
  default: false,
});

export const currentPopUpState = atom({
  key: "currentPopUpState",
  default: "",
});

export const currentPostTitleState = atom({
  key: "currentPostTitleState",
  default: "",
});

export const currentPostTextState = atom({
  key: "currentPostTextState",
  default: "",
});

export const currentPostIdState = atom({
  key: "currentPostIdState",
  default: "",
});

export const currentVoteContentState = atom({
  key: "currentVoteContentState",
  default: {},
});

export const currentUserDataState = atom({
  key: "currentUserDataState",
  default: {},
});
