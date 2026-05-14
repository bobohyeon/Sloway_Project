package com.sloway.app.place.dto.request.place;

import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Getter
@Setter
public class PlaceReqDto {

    private String type;
    private String title;
    private String content;
    private String address;
    private String detailAddress;
    private String latitude;
    private String longitude;
    private List<ImageDto> images;

    @Getter
    @Setter
    public static class ImageDto {
        private MultipartFile imageFile;
        private int sort;
    }

    //이미지까지 한번에 처리할 수 있도록 aws이미지 삽입 후 사용
    public PlaceEntity toEntity(List<String> awsImageUrls){
        PlaceEntity place = PlaceEntity.builder()
                .type(type)
                .title(title)
                .content(content)
                .address(address)
                .detailAdderss(detailAddress)
                .latitude(latitude)
                .longitude(longitude)
                .build();
        if (images != null && !images.isEmpty() && awsImageUrls != null) {
            List<ImgPlaceEntity> imageEntities = IntStream.range(0, Math.min(images.size(), awsImageUrls.size()))
                    .mapToObj(i -> ImgPlaceEntity.builder()
                            .currentUrl(awsImageUrls.get(i))
                            .sort(images.get(i).getSort())
                            .placeEntity(place)
                            .build())
                    .collect(Collectors.toList());

            place.setImages(imageEntities);

        }
        return place;
    }
}
