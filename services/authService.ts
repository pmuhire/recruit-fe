import { apiRequest } from "./api";

export const loginUser = async (username: string, password: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}`;
  console.log(url)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(res)
    throw new Error(data.message || "Login failed");
  }

  // Store token in cookie
  document.cookie = `token=${data.token}; path=/`;

  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);

  return data;
};
export const registerUser = async (form: any) => {
  return apiRequest("/auth/register", "POST", form);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};