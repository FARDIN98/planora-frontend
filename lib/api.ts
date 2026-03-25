interface ValidationDetail {
  path?: (string | number)[];
  message: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: ValidationDetail[],
  ) {
    super(message);
  }
}

function buildErrorMessage(
  message: string,
  details?: ValidationDetail[],
): string {
  if (!details?.length) return message;

  const summary = details
    .slice(0, 3)
    .map((d) => {
      const field = d.path?.length ? d.path.join(".") : null;
      return field ? `${field}: ${d.message}` : d.message;
    })
    .join(" • ");

  const extra = details.length > 3 ? ` (+${details.length - 3} more)` : "";
  return `${message} — ${summary}${extra}`;
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });
  const json = await res.json();
  if (!json.success) {
    const details = json.error?.details as ValidationDetail[] | undefined;
    throw new ApiError(
      res.status,
      json.error?.code || "UNKNOWN",
      buildErrorMessage(json.error?.message || "Something went wrong", details),
      details,
    );
  }
  return json.data as T;
}
