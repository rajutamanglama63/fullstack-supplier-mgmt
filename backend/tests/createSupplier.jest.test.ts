import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { CreateSupplierInput } from "../src/types.js";
import { app, pendingSupplier, serviceMocks } from "./helpers/supplierRouteTest.js";

describe("POST /api/suppliers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates body and creates supplier", async () => {
    const input: CreateSupplierInput = {
      companyName: "Alpha GmbH",
      vatId: "DE123",
      country: "Germany",
      contactEmail: "ops@alpha.test",
    };

    serviceMocks.validateCreateSupplierInput.mockReturnValueOnce(input);
    serviceMocks.createSupplier.mockResolvedValueOnce(pendingSupplier);

    const response = await request(app)
      .post("/api/suppliers")
      .set("X-User-Id", "anna")
      .send(input);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(serviceMocks.validateCreateSupplierInput).toHaveBeenCalledWith(input);
    expect(serviceMocks.createSupplier).toHaveBeenCalledWith(input, {
      id: "anna",
      name: "Anna Requester",
      role: "requester",
    });
  });
});
