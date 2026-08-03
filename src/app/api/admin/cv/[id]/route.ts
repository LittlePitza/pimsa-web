import { NextResponse, type NextRequest } from "next/server";
import { getApplicationFile } from "@/db/queries/applications";
import { getAdminSession } from "@/lib/auth";
import { canAccess } from "@/lib/roles";

export const runtime = "nodejs";

/** Streams a stored CV to RRHH (candidate data never leaves that area). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!canAccess(session.role, "rrhh")) {
    return NextResponse.json({ error: "Sin acceso a esta área" }, { status: 403 });
  }

  const { id } = await params;
  const fileId = Number(id);
  if (!Number.isInteger(fileId)) {
    return NextResponse.json({ error: "Identificador inválido" }, { status: 400 });
  }

  const file = await getApplicationFile(fileId);
  if (!file) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
