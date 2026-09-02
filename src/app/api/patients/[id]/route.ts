import { updatePatient, deletePatient } from "@/lib/jsonStore";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updatePatient(id, body);
    if (!updated) {
      return Response.json({ ok: false, error: "Patient not found" }, { status: 404 });
    }
    return Response.json({ ok: true, patient: updated });
  } catch (e) {
    return Response.json({ ok: false, error: "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = deletePatient(id);
  if (!success) {
    return Response.json({ ok: false, error: "Patient not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
