export interface FetchPostParams<T> {
  url?: string;
  body?: T;
  api?: string;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export const fetchPost = async <TRequest = unknown, TResponse = unknown>({
  url,
  body,
  api,
  headers,
  signal,
}: FetchPostParams<TRequest>): Promise<TResponse> => {
  const baseUrl = url ?? `http://localhost:8000/api/${api ?? ""}`;
  console.log("Making POST request to:", baseUrl);

  const response = await fetch(`${baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = await response.json();
      errorMessage = errorData?.detail || errorData?.message || errorMessage;
    } catch {
      //
    }

    throw new Error(errorMessage);
  }

  return response.json();
};
