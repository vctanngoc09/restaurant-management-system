import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header/Header";

import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;