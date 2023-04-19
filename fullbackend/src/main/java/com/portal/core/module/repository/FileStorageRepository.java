package com.portal.core.module.repository;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.module.entities.FileStorage;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface FileStorageRepository extends CRUDDao<FileStorage, String> {
}
