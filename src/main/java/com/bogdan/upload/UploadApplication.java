package com.bogdan.upload;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class UploadApplication {

	public static void main(String[] args) {
		SpringApplication.run(UploadApplication.class, args);
	}

	@PostConstruct
	public void init() {
		File uploadDir = new File("uploads");
		if (!uploadDir.exists()) {
			uploadDir.mkdir();
		}
	}

}
