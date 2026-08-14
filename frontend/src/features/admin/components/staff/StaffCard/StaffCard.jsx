import {
  CheckCircle2,
  Phone,
  Clock3,
} from "lucide-react";

import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import { STAFF_ROLE_LABELS } from "../../../../../constants/staffRoles";

import styles from "./StaffCard.module.css";

function StaffCard({ staff, onEdit, onDelete }) {
  return (
    <article className={styles.card}>
      <div>
        {/* ROLE + PIN */}
        <div className={styles.top}>
          <span className={styles.role}>
            {STAFF_ROLE_LABELS[staff.role] || staff.role}
          </span>

          <span className={styles.pin}>PIN: {staff.pin}</span>
        </div>

        {/* INFORMATION */}
        <div className={styles.information}>
          <div className={styles.avatar}>
            {staff.name.trim().charAt(0).toUpperCase()}
          </div>

          <div className={styles.nameGroup}>
            <h3>{staff.name}</h3>

            <span className={styles.staffId}>{staff.id}</span>
          </div>
        </div>

        <div className={styles.details}>
          <div>
            <Clock3 size={14} />

            <span>{staff.shift || "Chưa phân ca"}</span>
          </div>

          <div>
            <Phone size={14} />

            <span>{staff.phone || "Chưa có SĐT"}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span className={styles.status}>
          <CheckCircle2 size={14} />
          Hoạt động
        </span>

        <ActionGroup>
          <ActionButton
              action="edit"
              title={`Sửa nhân viên ${staff.name}`}
              onClick={() => onEdit(staff)}
          />

          <ActionButton
              action="delete"
              title={`Xóa nhân viên ${staff.name}`}
              onClick={() => onDelete(staff)}
          />
        </ActionGroup>
      </footer>
    </article>
  );
}

export default StaffCard;
