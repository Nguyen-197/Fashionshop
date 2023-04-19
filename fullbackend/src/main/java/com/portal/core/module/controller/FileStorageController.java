package com.portal.core.module.controller;

import com.portal.core.common.result.Response;
import com.portal.core.common.result.ResponseFile;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.entities.FileStorage;
import com.portal.core.module.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/file-storage")
public class FileStorageController {
    @Autowired
    private FileStorageService fileStorageService;

    Logger logger = LoggerFactory.getLogger(FileStorageController.class);


    @PostMapping("/upload")
    private Response handleUploadFile(@RequestParam("file") MultipartFile file) {
        try {
            FileStorage fileStorage = fileStorageService.store(file);
            logger.info("Uploaded the file successfully: " + file.getOriginalFilename());
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/file-storage/files/")
                    .path(fileStorage.getUuid().toString())
                    .toUriString();
            ResponseFile fileResult = new ResponseFile(
                    fileStorage.getUuid(),
                    fileStorage.getName(),
                    fileDownloadUri,
                    fileStorage.getType(),
                    fileDownloadUri.length());
            return Response.success().withData(fileResult);
        } catch (Exception e) {
            logger.error("Uploaded the file failed: " + file.getOriginalFilename());
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }
    @GetMapping("/files/{uuid}")
    public ResponseEntity<byte[]> getFile(@PathVariable String uuid) {
        FileStorage fileStorage = fileStorageService.getFile(uuid);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileStorage.getName() + "\"")
                .body(fileStorage.getData());
    }

    @DeleteMapping("/remove-file/{uuid}")
    public Response removeFile(@PathVariable String uuid) {
        try {
            if (CommonUtils.isNullOrEmpty(uuid)) {
                return Response.error(Constants.RESPONSE_CODE.MISSING_PARAM);
            }
            FileStorage file = fileStorageService.getFile(uuid);
            if (file == null) {
                return Response.error(Constants.RESPONSE_CODE.RECORD_DELETED);
            }
            fileStorageService.deleteById(uuid);
            return Response.success().withData(file);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }

    @GetMapping("/find-by-ids")
    public Response findAllByIds(@RequestParam List<String> listUuid) {
        List<FileStorage> listFileStorage = fileStorageService.findByIds(listUuid);
        List<ResponseFile> lstResponseFile = new ArrayList<>();
        for (FileStorage fileStorage: listFileStorage) {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/file-storage/files/")
                    .path(fileStorage.getUuid().toString())
                    .toUriString();
            ResponseFile fileResult = new ResponseFile(
                    fileStorage.getUuid(),
                    fileStorage.getName(),
                    fileDownloadUri,
                    fileStorage.getType(),
                    fileDownloadUri.length());
            lstResponseFile.add(fileResult);
        }
        return Response.success().withData(lstResponseFile);
    }
}
