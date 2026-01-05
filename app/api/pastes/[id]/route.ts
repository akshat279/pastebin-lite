import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const paste = await prisma.paste.findUnique({
    where: { id: params.id },
  });

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now =
    process.env.TEST_MODE === "1"
      ? new Date(Number(req.headers.get("x-test-now-ms")))
      : new Date();

  if (paste.expiresAt && now > paste.expiresAt) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  const updated = await prisma.paste.update({
    where: { id: paste.id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json({
    content: updated.content,
    remaining_views:
      updated.maxViews !== null
        ? updated.maxViews - updated.views
        : null,
    expires_at: updated.expiresAt,
  });
}
