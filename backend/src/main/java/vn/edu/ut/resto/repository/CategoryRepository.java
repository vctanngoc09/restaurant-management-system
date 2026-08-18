package vn.edu.ut.resto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.ut.resto.model.Category;

@Repository
public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(
            String name,
            Long id
    );
}