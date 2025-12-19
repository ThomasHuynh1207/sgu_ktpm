import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // warm-up
    { duration: '30s', target: 30 },   // bắt đầu stress
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },  // hệ thống yếu sẽ bắt đầu chậm
    { duration: '30s', target: 150 },
    { duration: '30s', target: 200 },  // tìm điểm gãy
    { duration: '30s', target: 0 },    // cooldown
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],        // cho phép lỗi <5%
    http_req_duration: ['p(95)<2000'],     // 95% request < 2s
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  // 1️⃣ LOGIN
  const loginPayload = JSON.stringify({
    username: 'admin',     // đổi nếu cần
    password: '123456',    // đổi nếu cần
  });

  const loginRes = http.post(
    `${BASE_URL}/api/user/login`,
    loginPayload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(loginRes, {
    'Login status 200': (r) => r.status === 200,
    'Có token': (r) => r.json('token') !== undefined,
  });

  if (loginRes.status !== 200) {
    return; // login fail thì dừng iteration
  }

  const token = loginRes.json('token');

  // 2️⃣ API BẢO VỆ (ví dụ /me)
  const meRes = http.get(
    `${BASE_URL}/api/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  check(meRes, {
    'GET /me OK': (r) => r.status === 200,
  });

  sleep(1);
}
