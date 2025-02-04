package com.bogdan.upload.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@Slf4j
public class FileUploadController {

    @Value("${spring.servlet.multipart.location}")
    private String uploadPath;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            Path targetLocation = Paths.get(uploadPath).resolve(fileName);

            log.info("Starting to upload file: {}", fileName);
            long startTime = System.currentTimeMillis();

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            long endTime = System.currentTimeMillis();
            log.info("File {} uploaded successfully. Time taken: {} ms", fileName, (endTime - startTime));

            return ResponseEntity.ok()
                    .header("Connection", "close")
                    .body("Upload successful");
        } catch (Exception e) {
            log.error("Upload failed for file: " + file.getOriginalFilename(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header("Connection", "close")
                    .body("Upload failed: " + e.getMessage());
        }
    }
}