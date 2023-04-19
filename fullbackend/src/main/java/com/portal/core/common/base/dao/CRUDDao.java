package com.portal.core.common.base.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

@NoRepositoryBean
public interface CRUDDao<T, ID> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
    List<T> findAll();

    Page<T> findAll(Pageable pageable);
}
