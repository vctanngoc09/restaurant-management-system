import styles from "./ActionButton.module.css";

function ActionGroup({ children, align = "right" }) {
  return (
    <div
      className={`
        ${styles.group}
        ${styles[align]}
      `}
    >
      {children}
    </div>
  );
}

export default ActionGroup;
