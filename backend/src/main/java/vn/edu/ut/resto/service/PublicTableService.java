package vn.edu.ut.resto.service;

import vn.edu.ut.resto.dto.response.PublicTableOrderResponse;

public interface PublicTableService {

    PublicTableOrderResponse getTableOrderByQrToken(
            String qrToken
    );
}