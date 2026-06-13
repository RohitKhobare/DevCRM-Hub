package com.devcrm.controller;

import com.devcrm.entity.Profile;
import com.devcrm.repository.ProfileRepository;
import com.devcrm.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.getOrDefault("fullName", "");
        if (profileRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error","Email already exists"));
        }
        Profile p = new Profile();
        p.setEmail(email);
        p.setFullName(fullName);
        p.setPasswordHash(passwordEncoder.encode(password));
        profileRepository.save(p);
        String token = jwtUtil.generateToken(p.getId(), p.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "user", Map.of("id", p.getId(), "email", p.getEmail(), "fullName", p.getFullName())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        var maybe = profileRepository.findByEmail(email);
        if (maybe.isEmpty()) return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
        var p = maybe.get();
        if (!passwordEncoder.matches(password, p.getPasswordHash())) return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
        String token = jwtUtil.generateToken(p.getId(), p.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "user", Map.of("id", p.getId(), "email", p.getEmail(), "fullName", p.getFullName(), "role", p.getRole())));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) return ResponseEntity.status(401).body(Map.of("error","Missing token"));
        String token = auth.substring(7);
        try {
            var claims = jwtUtil.parse(token);
            String userId = claims.getBody().getSubject();
            var maybe = profileRepository.findById(userId);
            if (maybe.isEmpty()) return ResponseEntity.status(404).body(Map.of("error","User not found"));
            var p = maybe.get();
            return ResponseEntity.ok(Map.of("id", p.getId(), "email", p.getEmail(), "fullName", p.getFullName(), "role", p.getRole()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error","Invalid token"));
        }
    }
}
