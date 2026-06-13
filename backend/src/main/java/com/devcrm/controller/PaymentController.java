package com.devcrm.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import org.json.JSONObject;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayClient client;

    public PaymentController(@Value("${razorpay.key_id}") String keyId, @Value("${razorpay.key_secret}") String keySecret) throws Exception {
        this.client = new RazorpayClient(keyId, keySecret);
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody HashMap<String, Object> body) throws Exception {
        Integer amount = (Integer) body.getOrDefault("amount", 1000);
        JSONObject options = new JSONObject();
        options.put("amount", amount); // amount in paise
        options.put("currency", "INR");
        Order order = client.Orders.create(options);
        return ResponseEntity.ok(order.toString());
    }
}
