const API_URL = "http://localhost:9000/api/v1/dashboard";

function getToken() {
  return localStorage.getItem("token");
}

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Something went wrong");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export async function getDashboard() {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}
