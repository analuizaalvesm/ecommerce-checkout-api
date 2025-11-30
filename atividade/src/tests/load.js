import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "1m", target: 50 }, // ramp-up
    { duration: "2m", target: 50 }, // platô
    { duration: "30s", target: 0 }, // ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // p95 < 500ms
    http_req_failed: ["rate<0.01"], // erros < 1%
  },
};

export default function () {
  const url = `${BASE_URL}/checkout/simple`;

  const payload = JSON.stringify({
    userId: 123,
    items: [
      { productId: "SKU-1", quantity: 1, price: 100 },
      { productId: "SKU-2", quantity: 2, price: 50 },
    ],
    paymentMethod: "credit_card",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status é 201": (r) => r.status === 201,
  });

  sleep(1);
}
