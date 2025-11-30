import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // carga baixa
    { duration: "10s", target: 300 }, // spike rápido
    { duration: "1m", target: 300 }, // mantém o pico
    { duration: "10s", target: 10 }, // queda rápida
    { duration: "30s", target: 10 }, // estabiliza de novo
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  const url = `${BASE_URL}/checkout/simple`;

  const payload = JSON.stringify({
    userId: 456,
    items: [{ productId: "SKU-3", quantity: 1, price: 200 }],
    paymentMethod: "pix",
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
