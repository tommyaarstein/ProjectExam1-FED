const AUTH_URL = "https://v2.api.noroff.dev/auth";

export async function registerUser(userData) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.errors?.[0]?.message || "Could not create account.";
    throw new Error(errorMessage);
  }

  return result.data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.errors?.[0]?.message || "Could not log in.";
    throw new Error(errorMessage);
  }

  return result.data;
}
