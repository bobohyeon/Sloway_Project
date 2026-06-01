package com.sloway.app.aws.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
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

    private final String S3_DOMAIN = "https://sloway-fileserver.s3.ap-northeast-2.amazonaws.com/";

    public String upload(MultipartFile file, String folder) throws IOException {
        String ext = extractExtension(file.getOriginalFilename());
        String s3Key = folder + "/" + UUID.randomUUID() + ext;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(s3Key)
                        .contentType(file.getContentType())
                        .contentLength(file.getSize())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // 풀 URL 반환
        return S3_DOMAIN + s3Key;
    }

    private String extractExtension(String originalFilename) {
        if(originalFilename == null || !originalFilename.contains(".")){return "";}
        return originalFilename.substring(originalFilename.lastIndexOf("."));
    }

    public void delete(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("http")) {
            return; // URL이 아니면 삭제 시도 안 함
        }

        // URL에서 도메인 부분 제거하여 S3 Key만 추출
        String s3Key = fileUrl.replace(S3_DOMAIN, "");

        s3Client.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(s3Key)
                        .build()
        );
    }
}
