package vn.edu.ut.resto.service.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import vn.edu.ut.resto.service.QrCodeService;

import java.io.ByteArrayOutputStream;

@Service
public class QrCodeServiceImpl
        implements QrCodeService {

    @Value("${app.frontend-url}")
    private String frontendUrl;


    @Override
    public byte[] generateTableQrCode(
            String qrToken,
            int width,
            int height
    ) {

        try {

            String publicUrl =
                    frontendUrl
                            + "/table/"
                            + qrToken;


            BitMatrix bitMatrix =
                    new MultiFormatWriter()
                            .encode(
                                    publicUrl,
                                    BarcodeFormat.QR_CODE,
                                    width,
                                    height
                            );


            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();


            MatrixToImageWriter.writeToStream(
                    bitMatrix,
                    "PNG",
                    outputStream
            );


            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không thể tạo mã QR.",
                    e
            );
        }
    }
}