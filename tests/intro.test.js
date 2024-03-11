import { describe, test, it, expect } from "vitest";
import { max, fizzBuzz, calculateAverage, factorial } from "../src/intro";

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });

  it("should return the second argument if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });
});

describe("fizzBuzz", () => {
  it("should return FizzBuzz if it is divided by 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  it("should return Fizz if it is divided only by 3", () => {
    expect(fizzBuzz(9)).toBe("Fizz");
  });

  it("should return Buzz if it is divided only by 5", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });

  it("should return string with input number in any other case", () => {
    const n = 2;
    expect(fizzBuzz(2)).toBe(n.toString());
  });
});

describe("calculateAverage", () => {
  it("should return NaN if input array is empty", () => {
    expect(calculateAverage([])).toBe(NaN)
  });

  it("should return element if input array has one element", () => {
    expect(calculateAverage([1])).toBe(1)
  });

  it("should return Average if input array has two elements", () => {
    expect(calculateAverage([1,2])).toBe(1.5)
  });
});

describe("factorial", () => {

  it("should return 1 if input number is 0", () => {
    expect(factorial(0)).toBe(1)
  });

  it("should return 1 if input number is 1", () => {
    expect(factorial(1)).toBe(1)
  });

  it("should return 2 if input number is 2", () => {
    expect(factorial(2)).toBe(2)
  });

  it("should return 6 if input number is 3", () => {
    expect(factorial(3)).toBe(6)
  });

  it("should return 6 if input number is 4", () => {
    expect(factorial(4)).toBe(24)
  });

  it("should return undefined if input number is negative", () => {
    expect(factorial(-1)).toBeUndefined()
  });
});
