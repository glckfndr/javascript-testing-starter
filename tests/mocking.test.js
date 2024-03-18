import { send } from "vite";
import { it, expect, describe, vi } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

vi.mock("../src/libs/currency.js");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

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

  describe("renderPage", () => {
    it("should correct content", async () => {
      const result = await renderPage();
      expect(result).toMatch(/content/i);
    });

    it("should call analytics", async () => {
      await renderPage();
      expect(trackPageView).toHaveBeenCalledWith("/home");
    });
  });

  describe("submitOrder", () => {
    const creditCard = { creditCardNumber: 100 };
    const order = { totalAmount: 3 };
    it("should call function charge", async () => {
      vi.mocked(charge).mockResolvedValue({ status: "success" });

      await submitOrder(order, creditCard);

      expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
    });

    it("should return error if status failed", async () => {
      vi.mocked(charge).mockResolvedValue({ status: "failed" });

      const result = await submitOrder(order, creditCard);

      expect(result).toEqual({ success: false, error: "payment_error" });
    });

    it("should return success if status true", async () => {
      vi.mocked(charge).mockResolvedValue({ status: "success" });

      const result = await submitOrder(order, creditCard);

      expect(result.success).toEqual(true);
    });
  });
});
