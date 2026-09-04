package vn.edu.ut.resto.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.resto.service.impl.PayOSPaymentService;
import vn.payos.model.webhooks.Webhook;

import java.util.Map;

@RestController
@RequestMapping("/api/payments/payos")
public class PayOSWebhookController {
    private final PayOSPaymentService payOSPaymentService;

    public PayOSWebhookController(PayOSPaymentService payOSPaymentService) {
        this.payOSPaymentService = payOSPaymentService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> webhook(@RequestBody Webhook webhook) {
        payOSPaymentService.handleWebhook(webhook);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
