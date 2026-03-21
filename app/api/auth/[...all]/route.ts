import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function proxyAuth(req: NextRequest) {
  const url = new URL(req.url);
  const backendPath = url.pathname + url.search;
  const targetUrl = `${BACKEND_URL}${backendPath}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  const fetchInit: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    fetchInit.body = await req.arrayBuffer();
  }

  const response = await fetch(targetUrl, fetchInit);

  const resHeaders = new Headers();
  response.headers.forEach((value, key) => {
    resHeaders.append(key, value);
  });

  // For redirects, forward the Location header and Set-Cookie
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      resHeaders.set("location", location);
    }
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: resHeaders,
  });
}

export const GET = proxyAuth;
export const POST = proxyAuth;
