import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { app, pendingSupplier, serviceMocks } from "./helpers/supplierRouteTest.js";

describe("POST /api/suppliers/:id/approve", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("approves supplier", async () => {
    serviceMocks.approveSupplier.mockResolvedValueOnce({
      ...pendingSupplier,
      status: "APPROVED",
      approvedBy: "max",
    });

    const response = await request(app)
      .post("/api/suppliers/sup-1/approve")
      .set("X-User-Id", "max");

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("APPROVED");
    expect(serviceMocks.approveSupplier).toHaveBeenCalledWith("sup-1", {
      id: "max",
      name: "Max Approver",
      role: "approver",
    });
  });
});
