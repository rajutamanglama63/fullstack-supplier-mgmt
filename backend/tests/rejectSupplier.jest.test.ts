import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { app, pendingSupplier, serviceMocks } from "./helpers/supplierRouteTest.js";

describe("POST /api/suppliers/:id/reject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates reason and rejects supplier", async () => {
    serviceMocks.validateRejectReason.mockReturnValueOnce("Missing tax proof");
    serviceMocks.rejectSupplier.mockResolvedValueOnce({
      ...pendingSupplier,
      status: "REJECTED",
      rejectedBy: "max",
      rejectionReason: "Missing tax proof",
    });

    const response = await request(app)
      .post("/api/suppliers/sup-1/reject")
      .set("X-User-Id", "max")
      .send({ reason: "Missing tax proof" });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("REJECTED");
    expect(serviceMocks.validateRejectReason).toHaveBeenCalledWith({
      reason: "Missing tax proof",
    });
    expect(serviceMocks.rejectSupplier).toHaveBeenCalledWith(
      "sup-1",
      "Missing tax proof",
      {
        id: "max",
        name: "Max Approver",
        role: "approver",
      },
    );
  });
});
