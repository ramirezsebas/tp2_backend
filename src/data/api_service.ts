const BASE_URL = "http://localhost:3000/api";
export class ApiService {
  async get(path: string) {
    const response = await fetch(`${BASE_URL}${path}`);

    const data = await response.json();
    if (response.status >= 400 && response.status < 600) {
      throw new Error(data?.message ?? response.statusText);
    }
    return data;
  }

  async post(path: string, body: any) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status >= 400 && response.status < 600) {
      console.log(response);
      throw new Error(data?.message ?? response.statusText);
    }

    return data;
  }

  async put(path: string, body: any) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status >= 400 && response.status < 600) {
      throw new Error(data?.message ?? response.statusText);
    }

    return data;
  }

  async delete(path: string) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.status >= 400 && response.status < 600) {
      throw new Error(data?.message ?? response.statusText);
    }
    return data;
  }
}
