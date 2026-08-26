package vn.edu.ut.resto.service.impl;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import vn.edu.ut.resto.exception.InvalidOperationException;

import vn.edu.ut.resto.service.CloudinaryService;

import java.util.Map;


@Service
public class CloudinaryServiceImpl
        implements CloudinaryService {


    private static final long MAX_IMAGE_SIZE =
            5 * 1024 * 1024;


    @Autowired
    private Cloudinary cloudinary;


    // =========================
    // UPLOAD / REPLACE IMAGE
    // =========================

    @Override
    public String uploadProductImage(
            Long productId,
            MultipartFile image
    ) {

        validateImage(image);


        /*
         * Public ID cố định theo Product ID.
         *
         * Ví dụ:
         *
         * Product id = 15
         *
         * resto/products/product_15
         */
        String publicId =
                buildProductPublicId(
                        productId
                );


        try {

            Map uploadResult =
                    cloudinary
                            .uploader()
                            .upload(
                                    image.getBytes(),

                                    ObjectUtils.asMap(

                                            "public_id",
                                            publicId,

                                            /*
                                             * Nếu product này đã có ảnh,
                                             * ghi đè ảnh mới lên.
                                             */
                                            "overwrite",
                                            true,

                                            /*
                                             * Đây là image.
                                             */
                                            "resource_type",
                                            "image"
                                    )
                            );


            Object secureUrl =
                    uploadResult.get(
                            "secure_url"
                    );


            if (secureUrl == null) {

                throw new InvalidOperationException(
                        "Cloudinary không trả về URL hình ảnh."
                );
            }


            return secureUrl.toString();

        } catch (InvalidOperationException e) {

            throw e;

        } catch (Exception e) {

            throw new InvalidOperationException(
                    "Không thể tải hình ảnh lên Cloudinary."
            );
        }
    }


    // =========================
    // DELETE IMAGE
    // =========================

    @Override
    public void deleteProductImage(
            Long productId
    ) {

        String publicId =
                buildProductPublicId(
                        productId
                );


        try {

            cloudinary
                    .uploader()
                    .destroy(
                            publicId,

                            ObjectUtils.asMap(
                                    "resource_type",
                                    "image"
                            )
                    );

        } catch (Exception e) {

            throw new InvalidOperationException(
                    "Không thể xóa hình ảnh trên Cloudinary."
            );
        }
    }


    // =========================
    // PUBLIC ID
    // =========================

    private String buildProductPublicId(
            Long productId
    ) {

        return "resto/products/product_"
                + productId;
    }


    // =========================
    // VALIDATE IMAGE
    // =========================

    private void validateImage(
            MultipartFile image
    ) {

        if (
                image == null
                        ||
                        image.isEmpty()
        ) {

            throw new InvalidOperationException(
                    "Vui lòng chọn hình ảnh."
            );
        }


        // =========================
        // MAX SIZE: 5MB
        // =========================

        if (
                image.getSize()
                        > MAX_IMAGE_SIZE
        ) {

            throw new InvalidOperationException(
                    "Dung lượng hình ảnh không được vượt quá 5MB."
            );
        }


        // =========================
        // FILE NAME
        // =========================

        String fileName =
                image.getOriginalFilename();


        if (
                fileName == null
                        ||
                        fileName.isBlank()
        ) {

            throw new InvalidOperationException(
                    "Tên file hình ảnh không hợp lệ."
            );
        }


        String lowerFileName =
                fileName.toLowerCase();


        boolean validExtension =
                lowerFileName.endsWith(".jpg")
                        ||
                        lowerFileName.endsWith(".jpeg")
                        ||
                        lowerFileName.endsWith(".png")
                        ||
                        lowerFileName.endsWith(".webp");


        if (!validExtension) {

            throw new InvalidOperationException(
                    "Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WEBP."
            );
        }


        // =========================
        // CONTENT TYPE
        // =========================

        String contentType =
                image.getContentType();


        /*
         * Postman đôi khi gửi file dưới dạng
         * application/octet-stream.
         *
         * Nếu extension đã hợp lệ thì vẫn
         * cho phép trường hợp này.
         */
        if (
                contentType != null
                        &&
                        !contentType.startsWith("image/")
                        &&
                        !contentType.equals(
                                "application/octet-stream"
                        )
        ) {

            throw new InvalidOperationException(
                    "File tải lên phải là hình ảnh."
            );
        }
    }
}