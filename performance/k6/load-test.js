import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 5 },
    { duration: "1m", target: 5 },
    { duration: "30s", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const BASE_URL = "http://localhost:5000";

export default function () {
  const loginRes = http.post(
    `${BASE_URL}/api/user/login`,
    JSON.stringify({
      username: "admin",      // 🔴 phải tồn tại trong DB
      password: "admin123",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(loginRes, {
    "Login thành công (200)": (r) => r.status === 200,
    "Có token": (r) => r.json("token") !== undefined,
  });

  const token = loginRes.json("token");
  if (!token) {
    console.log("LOGIN FAIL:", loginRes.status, loginRes.body);
    return;
  }

  const meRes = http.get(
    `${BASE_URL}/api/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  check(meRes, {
    "GET /me OK": (r) => r.status === 200,
  });

  sleep(1);
}
