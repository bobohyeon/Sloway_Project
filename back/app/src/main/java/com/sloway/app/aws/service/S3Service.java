package com.sloway.app.aws.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")// import 주의
    private String bucket;

    public String upload(MultipartFile file , String folder) throws IOException {

        // 전달받은 문자열로 확장자 추출
        String ext = extractExtension(file.getOriginalFilename());
        String s3key = folder + "/" + UUID.randomUUID() + ext;

        // 파일등록
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(s3key)
                        .contentType(file.getContentType())
                        .contentLength(file.getSize())
                        .build() ,
                RequestBody.fromBytes(file.getBytes())
        );
        return s3key;
    }

    private String extractExtension(String originalFilename) {
        if(originalFilename == null || !originalFilename.contains(".")){return "";}
        return originalFilename.substring(originalFilename.lastIndexOf("."));
    }

}
