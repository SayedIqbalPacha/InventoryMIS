const API_URL = "http://localhost:9000/api/v1/purchaseDetails";

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
    const error = new Error(
      data?.message || "Something went wrong."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// GET ALL PURCHASE DETAILS
export async function getPurchaseDetails() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response);
}

// GET ONE PURCHASE DETAIL
export async function getOnePurchaseDetail(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response);
}

// CREATE PURCHASE DETAIL
export async function createPurchaseDetail(detailData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(detailData),
  });

  return handleResponse(response);
}

// UPDATE PURCHASE DETAIL
export async function updatePurchaseDetail(id, detailData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(detailData),
  });

  return handleResponse(response);
}

// DELETE PURCHASE DETAIL
export async function deletePurchaseDetail(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response);
}