import { NextResponse } from "next/server";
import { getRtiById, updateRti, deleteRti } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rti = getRtiById(id);

    if (!rti) {
      return NextResponse.json(
        { success: false, error: "RTI application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rti });
  } catch (error) {
    console.error("Error fetching RTI by ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch RTI application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const updated = updateRti(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "RTI application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating RTI by ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update RTI application" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = deleteRti(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "RTI application not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "RTI application deleted successfully" });
  } catch (error) {
    console.error("Error deleting RTI by ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete RTI application" },
      { status: 500 }
    );
  }
}
