import {
  CheckCircle2,
  Phone,
  UserRound,
  CircleOff,
  RotateCcw,
} from "lucide-react";

import {
  ActionButton,
  ActionGroup,
} from "../../../../../components/common/ActionButton";

import { STAFF_ROLE_LABELS } from "../../../../../constants/staffRoles";

import styles from "./StaffCard.module.css";

function StaffCard({ staff, onEdit, onDelete, onRestore }) {
  const roles = (staff.roles || []).map((role) =>
    role.replace("ROLE_", "").toLowerCase(),
  );

  // Lấy tối đa 2 role đầu tiên
  const visibleRoles = roles.slice(0, 2);
  const hiddenRolesCount = roles.length - 2;

  const isActive = staff.status === "ACTIVE";

  return (
    <article className={styles.card}>
      <div>
        <div className={styles.top}>
          <div className={styles.roleList}>
            {/* Map qua danh sách role đã bị cắt */}
            {visibleRoles.map((role) => (
              <span key={role} className={styles.role}>
                {STAFF_ROLE_LABELS[role] || role}
              </span>
            ))}

            {/* Nếu còn role thừa, hiển thị thêm tag +X */}
            {hiddenRolesCount > 0 && (
              <span className={styles.role}>+{hiddenRolesCount}</span>
            )}
          </div>
          <div className={styles.staffId}>
            <span>ID: {staff.id}</span>
          </div>
        </div>

        <div className={styles.information}>
          <div className={styles.avatar}>
            {staff.fullName?.trim().charAt(0).toUpperCase()}
          </div>

          <div className={styles.nameGroup}>
            <h3>{staff.fullName}</h3>
          </div>
        </div>

        <div className={styles.details}>
          <div>
            <UserRound size={14} />

            <span>{staff.username}</span>
          </div>

          <div>
            <Phone size={14} />

            <span>{staff.phone || "Chưa có SĐT"}</span>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={isActive ? styles.status : styles.inactiveStatus}>
          {isActive ? <CheckCircle2 size={14} /> : <CircleOff size={14} />}

          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </span>

        <ActionGroup>
          <ActionButton
            action="edit"
            title={`Sửa nhân viên ${staff.fullName}`}
            onClick={() => onEdit(staff)}
          />

          {Number(staff.id) === 1 ? null : isActive ? (
            <ActionButton
              action="delete"
              title={`Vô hiệu hóa ${staff.fullName}`}
              onClick={() => onDelete(staff)}
            />
          ) : (
            <button
              type="button"
              className={styles.restoreButton}
              onClick={() => onRestore(staff)}
              title={`Khôi phục ${staff.fullName}`}
            >
              <RotateCcw size={15} />
            </button>
          )}
        </ActionGroup>
      </footer>
    </article>
  );
}

export default StaffCard;
