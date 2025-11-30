import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.2"],
  },
};

export default function () {
  const url = `${BASE_URL}/checkout/crypto`;

  const payload = JSON.stringify({
    userId: 123,
    data: "string-para-criptografia",
    iterations: 10000,
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

  sleep(0.5);
}
