// src/api/auth.ts

const API_BASE = "http://127.0.0.1:8000/api/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || Object.values(data)[0]);
  }

  return data;
};

export const signupUser = async (payload: SignupPayload) => {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || Object.values(data)[0]);
  }

  return data;
};
