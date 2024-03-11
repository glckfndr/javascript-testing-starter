import { it, expect, describe } from "vitest";
import { calculateDiscount, getCoupons, validateUserInput, isPriceInRange, isValidUsername} from "../src/core";

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
    discount = calculateDiscount("10", "SAVE10");
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

describe("validateUserInput", () => {
  const minAge = 18;
  const minLength = 3;
  const maxAge = 100;
  const maxLength = 255;
  const userName = "glc";

  it("should pass validation if username and age are valid ", () => {
    const validation = validateUserInput(userName, minAge);
    expect(validation).toMatch(/success/i);
  });

  it("should not pass validation if username length less than minLength", () => {
    const validation = validateUserInput(userName.substring(0, minLength - 1), minAge);
    expect(validation).toMatch(/Invalid username/i);
  });

  it("should not pass validation if username length greater than maxLength", () => {
    const validation = validateUserInput('a'.repeat(maxLength + 1), maxAge);
    expect(validation).toMatch(/Invalid username/i);
  });

  it("should not pass validation if username is not string", () => {
    const validation = validateUserInput(111, minAge);
    expect(validation).toMatch(/Invalid username/i);
  });

  it("should not pass validation if age less than minAge", () => {
    const validation = validateUserInput(userName, minAge - 1);
    expect(validation).toMatch(/Invalid age/i);
  });

  it("should not pass validation if age greater than maxAge", () => {
    const validation = validateUserInput(userName, maxAge + 1);
    expect(validation).toMatch(/Invalid age/i);
  });

  it("should not pass validation if age less is not number", () => {
    const validation = validateUserInput(userName, '18');
    expect(validation).toMatch(/Invalid age/i);
  });

  it("should not pass validation if user name and age is not valid ", () => {
    const validation = validateUserInput(1, '18');
    expect(validation).toMatch(/Invalid age/i);
    expect(validation).toMatch(/Invalid username/i);
  });
});

describe('isPriceInRange', () => {
  const minPrice = 0.0;
  const maxPrice = 100.0;
  it('should return true if price is on the boundary', () => {
    expect(isPriceInRange(maxPrice, minPrice, maxPrice)).toBeTruthy();
    expect(isPriceInRange(minPrice, minPrice, maxPrice)).toBeTruthy();
  })

  it('should return true if price is in the range', () => {
    expect(isPriceInRange(maxPrice - 0.1, minPrice, maxPrice)).toBeTruthy();
    expect(isPriceInRange(minPrice + 0.1, minPrice, maxPrice)).toBeTruthy();
  })

  it('should return false if price is out of the range', () => {
    expect(isPriceInRange(maxPrice + 0.1, minPrice, maxPrice)).toBeFalsy();
    expect(isPriceInRange(minPrice - 0.1, minPrice, maxPrice)).toBeFalsy();
  })
})

describe('isValidUsername', () => {
  const minLength = 5;
  const maxLength = 15;
  const username = 'a'

  it('should return true if username has min or max length', () => {
    expect(isValidUsername(username.repeat(minLength))).toBeTruthy();
    expect(isValidUsername(username.repeat(maxLength))).toBeTruthy();
  })

  it('should return true if username between min or max length', () => {
    expect(isValidUsername(username.repeat(minLength + 1))).toBeTruthy();
    expect(isValidUsername(username.repeat(maxLength -1))).toBeTruthy();
  })

  it('should return false if username is beyond min or max length', () => {
    expect(isValidUsername(username.repeat(minLength - 1))).toBeFalsy();
    expect(isValidUsername(username.repeat(maxLength + 1))).toBeFalsy();
  })

  it('should return false if username is invalid input time', () => {
    expect(isValidUsername(null)).toBeFalsy();
    expect(isValidUsername(undefined)).toBeFalsy();
    expect(isValidUsername(1)).toBeFalsy();
  })
})
