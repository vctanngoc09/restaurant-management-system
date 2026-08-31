package vn.edu.ut.resto.mapper;

import org.springframework.stereotype.Component;

import vn.edu.ut.resto.dto.request.PromotionRequest;
import vn.edu.ut.resto.dto.response.PromotionResponse;

import vn.edu.ut.resto.model.Promotion;

import java.math.BigDecimal;

@Component
public class PromotionMapper {

    public Promotion toEntity(PromotionRequest request) {

        if (request == null) {
            return null;
        }

        return new Promotion(
                normalizeCode(request.getCode()),
                normalize(request.getName()),
                normalize(request.getDescription()),
                request.getDiscountType(),
                request.getDiscountValue(),
                request.getMinOrderAmount(),
                request.getMaxDiscountAmount(),
                request.getStartAt(),
                request.getEndAt(),
                request.getUsageLimit(),
                request.getActive()
        );
    }


    public void updateEntity(
            PromotionRequest request,
            Promotion promotion
    ) {

        if (request == null || promotion == null) {
            return;
        }

        promotion.setCode(
                normalizeCode(request.getCode())
        );

        promotion.setName(
                normalize(request.getName())
        );

        promotion.setDescription(
                normalize(request.getDescription())
        );

        promotion.setDiscountType(
                request.getDiscountType()
        );

        promotion.setDiscountValue(
                request.getDiscountValue()
        );

        promotion.setMinOrderAmount(
                request.getMinOrderAmount() != null
                        ? request.getMinOrderAmount()
                        : BigDecimal.ZERO
        );

        promotion.setMaxDiscountAmount(
                request.getMaxDiscountAmount()
        );

        promotion.setStartAt(
                request.getStartAt()
        );

        promotion.setEndAt(
                request.getEndAt()
        );

        promotion.setUsageLimit(
                request.getUsageLimit()
        );

        if (request.getActive() != null) {
            promotion.setActive(
                    request.getActive()
            );
        }
    }


    public PromotionResponse toResponse(
            Promotion promotion
    ) {

        if (promotion == null) {
            return null;
        }

        return new PromotionResponse(
                promotion.getId(),
                promotion.getCode(),
                promotion.getName(),
                promotion.getDescription(),

                promotion.getDiscountType() != null
                        ? promotion.getDiscountType().name()
                        : null,

                promotion.getDiscountValue(),
                promotion.getMinOrderAmount(),
                promotion.getMaxDiscountAmount(),

                promotion.getStartAt(),
                promotion.getEndAt(),

                promotion.getUsageLimit(),
                promotion.getUsedCount(),
                promotion.getActive(),

                promotion.getCreatedAt(),
                promotion.getUpdatedAt()
        );
    }


    private String normalizeCode(String value) {

        if (value == null) {
            return null;
        }

        return value
                .trim()
                .toUpperCase();
    }


    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}