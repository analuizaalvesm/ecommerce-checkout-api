import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  vus: 1,
  duration: "30s",
  thresholds: {
    // 100% de sucesso nas requisições
    http_req_failed: ["rate==0"],
    checks: ["rate==1"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/health`);

  check(res, {
    "status é 200": (r) => r.status === 200,
  });
}
