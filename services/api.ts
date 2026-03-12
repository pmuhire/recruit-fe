export const apiRequest = async (url: string, method = "GET", body?: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) throw new Error("API request failed");

  return res.json();
};
