export async function readJsonResponse<T extends object>(
  response: Response,
): Promise<Partial<T>> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) return {};

  try {
    const payload: unknown = await response.json();
    return payload !== null && typeof payload === "object"
      ? (payload as Partial<T>)
      : {};
  } catch {
    return {};
  }
}
