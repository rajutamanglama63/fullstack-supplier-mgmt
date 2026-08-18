import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { app, pendingSupplier, serviceMocks } from "./helpers/supplierRouteTest.js";

describe("GET /api/suppliers/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns one supplier", async () => {
    serviceMocks.getSupplierById.mockResolvedValueOnce(pendingSupplier);

    const response = await request(app)
      .get("/api/suppliers/sup-1")
      .set("X-User-Id", "anna");

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe("sup-1");
    expect(serviceMocks.getSupplierById).toHaveBeenCalledWith("sup-1");
  });
});
