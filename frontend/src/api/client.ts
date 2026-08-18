/**
 * Shared fetch helper. Attaches X-User-Id and parses API error bodies.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Sends a JSON request with the current user id, then returns `data` or throws. */
export async function apiRequest<T>(
  userId: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      ...options?.headers,
    },
  });

  const body = (await response.json()) as {
    success: boolean;
    message: string;
    data?: T;
  };

  if (!response.ok || !body.success) {
    throw new ApiError(response.status, body.message || "Request failed.");
  }

  return body.data as T;
}
