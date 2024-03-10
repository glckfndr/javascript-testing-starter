import { it, expect, describe } from "vitest";
import { calculateDiscount, getCoupons } from "../src/core";

describe("getCoupons", () => {
  const coupons = getCoupons();

  it("should return array", () => {
    expect(Array.isArray(coupons)).toBeTruthy();
  });

  it("should return coupons with code and discount props", () => {
    expect(coupons.length).greaterThan(0);
    coupons.forEach((coupon) => {
      expect(coupon.code).toBeTypeOf("string");
      expect(coupon.discount).toBeTypeOf("number");
    });
  });

  it("should return coupons with discount > 0, <= 1", () => {
    expect(coupons.length).greaterThan(0);
    coupons.forEach((coupon) => {
      expect(coupon.discount).toBeLessThanOrEqual(1.0);
      expect(coupon.discount).toBeGreaterThan(0.0);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price when code is valid", () => {
    let discount = calculateDiscount(10, "SAVE10");
    expect(discount).toEqual(9);
    discount = calculateDiscount(10, "SAVE20");
    expect(discount).toEqual(8);
  });

  it("should handle wrong price", () => {
    let discount = calculateDiscount(-1, "SAVE10");
    expect(discount).toMatch(/invalid/i);
    discount = calculateDiscount('10', "SAVE10");
    expect(discount).toMatch(/invalid/i);
  });

  it("should handle when code is not string", () => {
    let discount = calculateDiscount(10, 10);
    expect(discount).toMatch(/invalid/i);
  });

  it("should handle when code is wrong", () => {
    let discount = calculateDiscount(10, "SAVE1");
    expect(discount).toEqual(10);
  });
});
