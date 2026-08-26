package vn.edu.ut.resto.service;

import org.springframework.web.multipart.MultipartFile;


public interface CloudinaryService {


    String uploadProductImage(
            Long productId,
            MultipartFile image
    );


    void deleteProductImage(
            Long productId
    );
}