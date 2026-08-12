import styles from "./KpiCard.module.css";

function KpiCard({
  label,
  value,
  description,
  descriptionType = "primary",
  icon: Icon,
  iconType = "indigo",
  descriptionIcon: DescriptionIcon,
}) {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>

        <strong className={styles.value}>{value}</strong>

        <span className={`${styles.description} ${styles[descriptionType]}`}>
          {DescriptionIcon && <DescriptionIcon size={13} />}

          {description}
        </span>
      </div>

      <div className={`${styles.icon} ${styles[iconType]}`}>
        <Icon size={24} />
      </div>
    </article>
  );
}

export default KpiCard;
