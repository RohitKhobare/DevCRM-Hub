package com.devcrm.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;

@RestController
public class WebhookController {

    @Value("${razorpay.webhook_secret}")
    private String webhookSecret;

    @PostMapping("/payments/webhook")
    public ResponseEntity<?> handleWebhook(HttpServletRequest request) throws Exception {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        String payload = sb.toString();
        // For brevity, we do not verify signature here in scaffold. Add verification in production.
        System.out.println("Received webhook: " + payload);
        return ResponseEntity.ok().build();
    }
}
