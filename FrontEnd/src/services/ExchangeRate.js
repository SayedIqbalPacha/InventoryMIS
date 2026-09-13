const API_URL = "http://localhost:9000/api/v1/exchangeRate";

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


// --------------------------------------------------
// GET ALL EXCHANGE RATES
// --------------------------------------------------

export async function getExchangeRates() {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response);
}


// --------------------------------------------------
// GET ONE EXCHANGE RATE
// --------------------------------------------------

export async function getOneExchangeRate(id) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return handleResponse(response);
}


// --------------------------------------------------
// CREATE EXCHANGE RATE
// --------------------------------------------------

export async function createExchangeRate(
  exchangeRateData
) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(
      exchangeRateData
    ),
  });

  return handleResponse(response);
}


// --------------------------------------------------
// UPDATE EXCHANGE RATE
// --------------------------------------------------

export async function updateExchangeRate(
  id,
  exchangeRateData
) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },

      body: JSON.stringify(
        exchangeRateData
      ),
    }
  );

  return handleResponse(response);
}


// --------------------------------------------------
// DELETE EXCHANGE RATE
// --------------------------------------------------

export async function deleteExchangeRate(id) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return handleResponse(response);
}

