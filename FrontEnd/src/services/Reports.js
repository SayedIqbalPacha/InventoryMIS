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

export async function getCustomerActivity({
  name,
  fromDate,
  toDate,
  customerId,
}) {
  // new URLSearchParams() is used to create a query string for the API request based on the provided parameters. Each parameter is conditionally added to the query string if it has a value. The fetch request is then made to the API endpoint with the constructed query string, and the response is handled accordingly.
  const params = new URLSearchParams();

  if (name) {
    params.set("name", name);
  }

  if (fromDate) {
    params.set("fromDate", fromDate);
  }

  if (toDate) {
    params.set("toDate", toDate);
  }

  if (customerId) {
    params.set("customerId", customerId);
  }

  const response = await fetch(
    `${API_URL}/customer-activity?${params.toString()}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return handleResponse(response);
}

export async function getVendorActivity({ vendorId, fromDate, toDate }) {
  // Build the query string the same way as customer activity so optional or
  // incomplete fields are handled consistently by the API.
  const params = new URLSearchParams();

  if (vendorId) {
    params.set("vendorId", vendorId);
  }

  if (fromDate) {
    params.set("fromDate", fromDate);
  }

  if (toDate) {
    params.set("toDate", toDate);
  }

  const response = await fetch(
    `${API_URL}/vendor-activity?${params.toString()}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return handleResponse(response);
}
