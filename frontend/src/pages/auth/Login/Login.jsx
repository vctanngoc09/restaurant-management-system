import LoginBrandPanel from "../../../features/auth/components/LoginBrandPanel/LoginBrandPanel";
import LoginForm from "../../../features/auth/components/LoginForm/LoginForm";

import styles from "./Login.module.css";

function Login() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <LoginBrandPanel />

        <div className={styles.formSection}>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

export default Login;