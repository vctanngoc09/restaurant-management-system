import styles from "./DashboardTabs.module.css";

function DashboardTabs({
  activeTab,

  onTabChange,

  tabs = [],

  rightContent = null,
}) {
  return (
    <div className={styles.tabsBar}>
      {/* ==================================================
          LEFT TABS
      ================================================== */}

      <div className={styles.tabsLeft}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {/* =========================
                  LABEL
              ========================= */}

            <span>{tab.label}</span>

            {/* =========================
                  COUNT
              ========================= */}

            {tab.count !== undefined && tab.count !== null && (
              <span className={styles.tabCount}>{tab.count}</span>
            )}

            {/* =========================
                  NOTIFICATION DOT
              ========================= */}

            {tab.notification && <i className={styles.notificationDot} />}
          </button>
        ))}
      </div>

      {/* ==================================================
          RIGHT CONTENT

          Ví dụ Cashier:
          [ + Tạo đơn hàng mới ]

          Waiter:
          null
      ================================================== */}

      {rightContent && (
        <div className={styles.rightContent}>{rightContent}</div>
      )}
    </div>
  );
}

export default DashboardTabs;
