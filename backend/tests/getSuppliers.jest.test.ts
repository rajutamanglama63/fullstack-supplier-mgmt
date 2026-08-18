import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { app, pendingSupplier, serviceMocks } from "./helpers/supplierRouteTest.js";

describe("GET /api/suppliers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns supplier list", async () => {
    serviceMocks.listSuppliers.mockResolvedValueOnce([pendingSupplier]);

    const response = await request(app)
      .get("/api/suppliers")
      .set("X-User-Id", "anna");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(serviceMocks.listSuppliers).toHaveBeenCalledTimes(1);
  });

  test("returns 401 when X-User-Id is missing", async () => {
    const response = await request(app).get("/api/suppliers");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(serviceMocks.listSuppliers).not.toHaveBeenCalled();
  });
});
