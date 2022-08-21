import { NextPage } from "next";
import { ReactNode } from "react";

import {Scene, Details} from "..";

import styles from "./layout.module.css";

interface Props {
    children: JSX.Element;
}
  

const LayoutContext: NextPage<Props> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

const Layout: NextPage = () => {
  return (
    <LayoutContext>
      <>
      <Scene></Scene>
      <Details></Details>
      </>
    </LayoutContext>
  );
};

export default Layout;