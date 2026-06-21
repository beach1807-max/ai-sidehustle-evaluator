type FeedbackEnv = {
  GOOGLE_SHEET_WEBHOOK_URL?: string;
  FEEDBACK_SECRET?: string;
};

type PagesContext = {
  request: Request;
  env: FeedbackEnv;
};

type FeedbackPayload = {
  createdAt?: string;
  idea?: string;
  score?: number | string;
  decision?: string;
  understandingLevel?: string;
  desiredOutputs?: string[];
  willingnessToPay?: string;
  confusingPart?: string;
  paidExpectation?: string;
  contactPermission?: string;
  contact?: string;
};

export async function onRequest(context: PagesContext): Promise<Response> {
  if (context.request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }

  if (!context.env.GOOGLE_SHEET_WEBHOOK_URL || !context.env.FEEDBACK_SECRET) {
    return jsonResponse(
      {
        ok: false,
        code: "FEEDBACK_WEBHOOK_NOT_CONFIGURED",
        error: "Feedback webhook is not configured",
      },
      503
    );
  }

  let payload: FeedbackPayload;
  try {
    payload = (await context.request.json()) as FeedbackPayload;
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
  }

  const sheetPayload = {
    secret: context.env.FEEDBACK_SECRET,
    createdAt: payload.createdAt || new Date().toISOString(),
    idea: payload.idea || "",
    score: payload.score || "",
    decision: payload.decision || "",
    feedbackOptions: [
      `understandingLevel: ${payload.understandingLevel || ""}`,
      `desiredOutputs: ${(payload.desiredOutputs || []).join(" / ")}`,
      `willingnessToPay: ${payload.willingnessToPay || ""}`,
      `contactPermission: ${payload.contactPermission || ""}`,
    ],
    feedbackText: [
      `confusingPart: ${payload.confusingPart || ""}`,
      `paidExpectation: ${payload.paidExpectation || ""}`,
    ].join("\n\n"),
    wantsDeepReport: true,
    contact: payload.contact || "",
    userAgent: context.request.headers.get("User-Agent") || "",
    source: "web",
  };

  try {
    const response = await fetch(context.env.GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheetPayload),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      return jsonResponse(
        {
          ok: false,
          code: "FEEDBACK_WEBHOOK_FAILED",
          error: "Feedback webhook request failed",
        },
        502
      );
    }

    return jsonResponse({ ok: true }, 200);
  } catch {
    return jsonResponse(
      {
        ok: false,
        code: "FEEDBACK_WEBHOOK_FAILED",
        error: "Feedback webhook request failed",
      },
      502
    );
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
