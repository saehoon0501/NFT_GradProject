import { Outlet } from "react-router-dom";
import { Header } from "./Header";

const Layout = ({ socketValue }) => {
  return (
    <>
      <Header socketValue={socketValue} />
      <Outlet />
    </>
  );
};

export { Layout };
