const API_URL = "http://localhost:9000/api/v1/reports";

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
    const error = new Error(data?.message || "Failed to load reports.");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export async function getReports() {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response);
}
