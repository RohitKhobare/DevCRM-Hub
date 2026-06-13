Backend scaffold (Spring Boot) and local DB

How to run locally:

1. Start Postgres and Adminer with Docker Compose:

```bash
docker-compose up -d
```

2. Build and run backend (requires Java 17 + Maven):

```bash
cd backend
mvn spring-boot:run
```

3. Configure Razorpay keys via environment variables or in `application.properties`:

- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

Notes:
- This is a minimal scaffold: authentication (register/login) returns a JWT token and basic Razorpay order creation endpoint exists at `/api/payments/create-order`.
- You will need to wire the frontend to use this backend (set `VITE_API_URL` or replace Supabase calls).
