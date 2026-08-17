package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.resto.model.Area;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
}