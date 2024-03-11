import { it, expect, describe } from "vitest";
import {
  calculateDiscount,
  getCoupons,
  validateUserInput,
  isPriceInRange,
  isValidUsername,
  canDrive,
  fetchData,
} from "../src/core";

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
    const validation = validateUserInput(
      userName.substring(0, minLength - 1),
      minAge
    );
    expect(validation).toMatch(/Invalid username/i);
  });

  it("should not pass validation if username length greater than maxLength", () => {
    const validation = validateUserInput("a".repeat(maxLength + 1), maxAge);
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
    const validation = validateUserInput(userName, "18");
    expect(validation).toMatch(/Invalid age/i);
  });

  it("should not pass validation if user name and age is not valid ", () => {
    const validation = validateUserInput(1, "18");
    expect(validation).toMatch(/Invalid age/i);
    expect(validation).toMatch(/Invalid username/i);
  });
});

describe("isPriceInRange", () => {
  const minPrice = 0.0;
  const maxPrice = 100.0;
  const testData = [
    { scenario: "price == max", price: maxPrice, expected: true },
    { scenario: "price == min", price: minPrice, expected: true },
    { scenario: "price < max", price: maxPrice - 0.1, expected: true },
    { scenario: "price > min", price: minPrice + 0.1, expected: true },
    { scenario: "price > max", price: maxPrice + 0.1, expected: false },
    { scenario: "price < min", price: minPrice - 0.1, expected: false },
  ];

  it.each(testData)(
    "should return $expected for $scenario",
    ({ price, expected }) => {
      expect(isPriceInRange(price, minPrice, maxPrice)).toBe(expected);
    }
  );
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  const username = "a";

  it("should return true if username has min or max length", () => {
    expect(isValidUsername(username.repeat(minLength))).toBeTruthy();
    expect(isValidUsername(username.repeat(maxLength))).toBeTruthy();
  });

  it("should return true if username between min or max length", () => {
    expect(isValidUsername(username.repeat(minLength + 1))).toBeTruthy();
    expect(isValidUsername(username.repeat(maxLength - 1))).toBeTruthy();
  });

  it("should return false if username is beyond min or max length", () => {
    expect(isValidUsername(username.repeat(minLength - 1))).toBeFalsy();
    expect(isValidUsername(username.repeat(maxLength + 1))).toBeFalsy();
  });

  it("should return false if username is invalid input time", () => {
    expect(isValidUsername(null)).toBeFalsy();
    expect(isValidUsername(undefined)).toBeFalsy();
    expect(isValidUsername(1)).toBeFalsy();
  });
});

describe("canDrive", () => {
  const legalDrivingAge = {
    US: 16,
    UK: 17,
  };
  const maxAge = 100;

  it("should return true for eligible age and correct countryCode", () => {
    Object.entries(legalDrivingAge).forEach(([code, age]) => {
      expect(canDrive(age, code)).toBe(true);
      expect(canDrive(age + 1, code)).toBe(true);
      expect(canDrive(maxAge, code)).toBe(true);
    });
  });

  it("should return false if age is not number", () => {
    Object.entries(legalDrivingAge).forEach(([code, age]) => {
      expect(canDrive("30", code)).toBe(false);
    });
  });

  it("should return false for underage", () => {
    Object.entries(legalDrivingAge).forEach(([code, age]) => {
      expect(canDrive(age - 1, code)).toBe(false);
    });
  });

  it("should return false if age is too big", () => {
    Object.entries(legalDrivingAge).forEach(([code, age]) => {
      expect(canDrive(maxAge + 1, code)).toBe(false);
    });
  });

  it("should return error if countryCode is invalid", () => {
    expect(canDrive(maxAge, "US1")).toMatch(/Invalid/i);
  });
});

describe("fetchData", () => {
  it("should return array", async () => {
    let received = await fetchData();
    expect(Array.isArray(received)).toBe(true);
    expect(received.length).greaterThan(0);
  });

  it("should return array with then", async () => {
    await fetchData().then((arr) => {
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).greaterThan(0);
    });
  });

  it("should return error", async () => {
    try {
      await fetchData(false);
    } catch (error) {
      expect(error).toMatch(/Error/i);
    }
  });

  it("should return error with then", async () => {
     const prom = fetchData(false)
     await prom.then((arr) => {
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).greaterThan(0);
    }).catch(error => expect(error).toMatch(/Error/i));
  });
});
