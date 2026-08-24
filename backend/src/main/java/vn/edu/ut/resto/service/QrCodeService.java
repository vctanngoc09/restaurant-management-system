package vn.edu.ut.resto.service;

public interface QrCodeService {

    byte[] generateTableQrCode(
            String qrToken,
            int width,
            int height
    );
}