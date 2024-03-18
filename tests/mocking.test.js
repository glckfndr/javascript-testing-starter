import { send } from "vite";
import { it, expect, describe, vi } from "vitest";
import { getPriceInCurrency, getShippingInfo } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";

vi.mock("../src/libs/currency.js");
vi.mock("../src/libs/shipping");

describe("test suit", () => {
  it("test case", () => {
    const sendText = vi.fn();
    sendText.mockImplementation((message) => "ok");
    const text = "message";
    expect(sendText(text)).toEqual("ok");
    expect(sendText).toHaveBeenCalledWith(text);
    expect(sendText).toHaveBeenCalled(1);
  });

  describe("getPriceInCurrency", () => {
    it("getPriceInCurrency should return price in US", () => {
      vi.mocked(getExchangeRate).mockReturnValue(1.3);
      expect(getPriceInCurrency(10, "AUD")).toEqual(13);
    });
  });

  describe("getShippingInfo", () => {
    it("should return shipping info if quote can be got", () => {
      vi.mocked(getShippingQuote).mockReturnValue({
        cost: 100,
        estimatedDays: 2,
      });

      expect(getShippingInfo("Odessa")).toMatch(/\$100.\(2 days\)/i);
    });

    it("should return shipping unavailable if quote can not be got", () => {
      vi.mocked(getShippingQuote).mockReturnValue(null);
      expect(getShippingInfo("shipping.com")).toMatch(/Unavailable/i);
    });
  });
});
