package vn.edu.ut.resto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.resto.dto.request.PromotionRequest;

import vn.edu.ut.resto.exception.InvalidOperationException;
import vn.edu.ut.resto.exception.ResourceNotFoundException;

import vn.edu.ut.resto.mapper.PromotionMapper;
import vn.edu.ut.resto.model.Promotion;

import vn.edu.ut.resto.model.enums.EDiscountType;

import vn.edu.ut.resto.repository.PromotionRepository;

import vn.edu.ut.resto.service.PromotionService;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.time.LocalDateTime;

import java.util.List;


@Service
public class PromotionServiceImpl
        implements PromotionService {


    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PromotionMapper promotionMapper;


    // ==================================================
    // CREATE
    // ==================================================

    @Override
    @Transactional
    public Promotion create(
            PromotionRequest request
    ) {

        validateRequest(request);

        Promotion promotion =
                promotionMapper.toEntity(request);

        if (promotionRepository
                .existsByCodeIgnoreCase(
                        promotion.getCode()
                )) {

            throw new InvalidOperationException(
                    "Mã giảm giá đã tồn tại."
            );
        }

        return promotionRepository.save(promotion);
    }


    // ==================================================
    // UPDATE
    // ==================================================

    @Override
    @Transactional
    public Promotion update(
            Long id,
            PromotionRequest request
    ) {

        Promotion promotion =
                getById(id);

        validateRequest(request);

        String newCode =
                request.getCode()
                        .trim()
                        .toUpperCase();

        promotionRepository
                .findByCodeIgnoreCase(newCode)
                .ifPresent(existing -> {

                    if (!existing.getId().equals(id)) {
                        throw new InvalidOperationException(
                                "Mã giảm giá đã tồn tại."
                        );
                    }
                });

        promotionMapper.updateEntity(
                request,
                promotion
        );

        return promotionRepository.save(promotion);
    }


    // ==================================================
    // GET ONE
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public Promotion getById(
            Long id
    ) {

        return promotionRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy chương trình giảm giá có ID: "
                                        + id
                        )
                );
    }


    // ==================================================
    // GET ALL
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public List<Promotion> getAll() {

        return promotionRepository
                .findAll();
    }


    // ==================================================
    // ENABLE / DISABLE
    // ==================================================

    @Override
    @Transactional
    public Promotion setActive(
            Long id,
            boolean active
    ) {

        Promotion promotion =
                getById(id);


        promotion.setActive(
                active
        );


        return promotionRepository
                .save(promotion);
    }


    // ==================================================
    // VALIDATE PROMOTION
    //
    // Sau này PaymentService dùng method này.
    // ==================================================

    @Override
    @Transactional(readOnly = true)
    public Promotion getValidPromotion(
            String code,
            BigDecimal subtotal
    ) {

        if (
                code == null
                        ||
                        code.isBlank()
        ) {

            throw new InvalidOperationException(
                    "Mã giảm giá không hợp lệ."
            );
        }


        Promotion promotion =
                promotionRepository
                        .findByCodeIgnoreCase(
                                normalizeCode(code)
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Mã giảm giá không tồn tại."
                                )
                        );


        if (
                !Boolean.TRUE.equals(
                        promotion.getActive()
                )
        ) {

            throw new InvalidOperationException(
                    "Mã giảm giá hiện không hoạt động."
            );
        }


        LocalDateTime now =
                LocalDateTime.now();


        if (
                now.isBefore(
                        promotion.getStartAt()
                )
        ) {

            throw new InvalidOperationException(
                    "Mã giảm giá chưa đến thời gian sử dụng."
            );
        }


        if (
                now.isAfter(
                        promotion.getEndAt()
                )
        ) {

            throw new InvalidOperationException(
                    "Mã giảm giá đã hết hạn."
            );
        }


        if (
                promotion.getUsageLimit()
                        != null
                        &&
                        promotion.getUsedCount()
                                >=
                                promotion.getUsageLimit()
        ) {

            throw new InvalidOperationException(
                    "Mã giảm giá đã hết lượt sử dụng."
            );
        }


        if (
                subtotal.compareTo(
                        promotion.getMinOrderAmount()
                ) < 0
        ) {

            throw new InvalidOperationException(
                    "Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã giảm giá."
            );
        }


        return promotion;
    }


    // ==================================================
    // CALCULATE DISCOUNT
    // ==================================================

    @Override
    public BigDecimal calculateDiscount(
            Promotion promotion,
            BigDecimal subtotal
    ) {

        BigDecimal discount;


        if (
                promotion.getDiscountType()
                        ==
                        EDiscountType.PERCENT
        ) {

            discount =
                    subtotal
                            .multiply(
                                    promotion.getDiscountValue()
                            )
                            .divide(
                                    BigDecimal.valueOf(100),
                                    2,
                                    RoundingMode.HALF_UP
                            );

        } else {

            discount =
                    promotion.getDiscountValue();
        }


        // ==================================================
        // MAX DISCOUNT
        // ==================================================

        if (
                promotion.getMaxDiscountAmount()
                        != null
                        &&
                        discount.compareTo(
                                promotion.getMaxDiscountAmount()
                        ) > 0
        ) {

            discount =
                    promotion
                            .getMaxDiscountAmount();
        }


        // Không cho giảm nhiều hơn bill.
        if (
                discount.compareTo(
                        subtotal
                ) > 0
        ) {

            discount = subtotal;
        }


        return discount;
    }


    // ==================================================
    // VALIDATE REQUEST
    // ==================================================

    private void validateRequest(
            PromotionRequest request
    ) {

        if (
                !request.getEndAt()
                        .isAfter(
                                request.getStartAt()
                        )
        ) {

            throw new InvalidOperationException(
                    "Thời gian kết thúc phải sau thời gian bắt đầu."
            );
        }


        if (
                request.getDiscountType()
                        ==
                        EDiscountType.PERCENT
                        &&
                        request.getDiscountValue()
                                .compareTo(
                                        BigDecimal.valueOf(100)
                                ) > 0
        ) {

            throw new InvalidOperationException(
                    "Phần trăm giảm giá không được lớn hơn 100%."
            );
        }
    }


    // ==================================================
    // APPLY
    // ==================================================

    private void applyRequest(
            Promotion promotion,
            PromotionRequest request,
            String code
    ) {

        promotion.setCode(
                code
        );

        promotion.setName(
                request.getName().trim()
        );

        promotion.setDescription(
                normalize(
                        request.getDescription()
                )
        );

        promotion.setDiscountType(
                request.getDiscountType()
        );

        promotion.setDiscountValue(
                request.getDiscountValue()
        );

        promotion.setMinOrderAmount(
                request.getMinOrderAmount()
                        == null
                        ?
                        BigDecimal.ZERO
                        :
                        request.getMinOrderAmount()
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


        if (
                request.getActive()
                        != null
        ) {

            promotion.setActive(
                    request.getActive()
            );
        }
    }


    private String normalizeCode(
            String code
    ) {

        return code
                .trim()
                .toUpperCase();
    }


    private String normalize(
            String value
    ) {

        if (
                value == null
                        ||
                        value.isBlank()
        ) {

            return null;
        }

        return value.trim();
    }
}