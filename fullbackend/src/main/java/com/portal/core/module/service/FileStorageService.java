package com.portal.core.module.service;

import com.portal.core.module.entities.FileStorage;
import com.portal.core.module.repository.FileStorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

@Service
public class FileStorageService {
    @Autowired
    private FileStorageRepository fileStorageRepository;

    public void deleteById(String uuid) { fileStorageRepository.deleteById(uuid); }
    public FileStorage store(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        FileStorage fileStorage = new FileStorage();
        fileStorage.setName(fileName);
        fileStorage.setType(file.getContentType());
        fileStorage.setData(file.getBytes());
        return fileStorageRepository.save(fileStorage);
    }
    public FileStorage getFile(String uuid) {
        return fileStorageRepository.findById(uuid).get();
    }

    public Stream<FileStorage> getAllFiles() {
        return fileStorageRepository.findAll().stream();
    }

    public List<FileStorage> findByIds(List<String> listUuid) {
        return fileStorageRepository.findAllById(listUuid);
    }
}
