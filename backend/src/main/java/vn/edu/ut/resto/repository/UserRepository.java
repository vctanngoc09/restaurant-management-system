package vn.edu.ut.resto.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.ut.resto.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByPhone(String phone);
    Boolean existsByUsernameAndIdNot(String username, Long id);
    Boolean existsByPhoneAndIdNot(String phone, Long id);

    // =========================
    // PAGINATION - STEP 1
    // ONLY GET IDS
    // =========================

    @Query(
            value = """
                    SELECT u.id
                    FROM User u
                    ORDER BY u.id DESC
                    """,
            countQuery = """
                    SELECT COUNT(u.id)
                    FROM User u
                    """
    )
    Page<Long> findUserIds(
            Pageable pageable
    );


    // =========================
    // PAGINATION - STEP 2
    // FETCH USER + ROLE
    // =========================

    @Query("""
            SELECT DISTINCT u
            FROM User u
            LEFT JOIN FETCH u.roles
            WHERE u.id IN :ids
            """)
    List<User> findUsersByIdsWithRoles(
            @Param("ids") List<Long> ids
    );
}