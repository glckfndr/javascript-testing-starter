import { it, expect, describe, vi } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
  signUp,
  login,
  isOnline,
  getDiscount
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency.js');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/mocking');
vi.mock('../src/libs/email', async(importOriginal) => {
  const module = await importOriginal();
  return { ...module, sendEmail: vi.fn() };
});

describe('test suit', () => {
  it('test case', () => {
    const sendText = vi.fn();
    sendText.mockImplementation((message) => 'ok');
    const text = 'message';
    expect(sendText(text)).toEqual('ok');
    expect(sendText).toHaveBeenCalledWith(text);
    expect(sendText).toHaveBeenCalled(1);
  });
});

describe('getPriceInCurrency', () => {
  it('getPriceInCurrency should return price in US', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.3);
    expect(getPriceInCurrency(10, 'AUD')).toEqual(13);
  });
});

describe('getShippingInfo', () => {
  it('should return shipping info if quote can be got', () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 100,
      estimatedDays: 2
    });

    expect(getShippingInfo('Odessa')).toMatch(/\$100.\(2 days\)/i);
  });

  it('should return shipping unavailable if quote can not be got', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    expect(getShippingInfo('shipping.com')).toMatch(/Unavailable/i);
  });
});

describe('renderPage', () => {
  it('should correct content', async() => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async() => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const creditCard = { creditCardNumber: 100 };
  const order = { totalAmount: 3 };
  it('should call function charge', async() => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return error if status failed', async() => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });

  it('should return success if status true', async() => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    const result = await submitOrder(order, creditCard);

    expect(result.success).toEqual(true);
  });
});

describe('signUp', () => {
  const validEmail = 'toot@gmail.com';

  it('should return false if email is not valid', async() => {
    const invalidEmail = 'toot!gmail.com';

    const result = await signUp(invalidEmail);
    expect(result).toEqual(false);
  });

  it('should return true if email is valid', async() => {
    const result = await signUp(validEmail);
    expect(result).toEqual(true);
  });

  it('should send email if email valid', async() => {
    await signUp(validEmail);

    expect(sendEmail).toHaveBeenCalledOnce();
    const calls = vi.mocked(sendEmail).mock.calls[0];
    expect(calls[0]).toEqual(validEmail);
    expect(calls[1]).toMatch(/welcome/i);
    expect(sendEmail).toBeCalled();
  });
});

describe('login', () => {
  it('should email the one-time login code', async() => {
    const validEmail = 'toot@gmail.com';
    const spy = vi.spyOn(security, 'generateCode');

    await login(validEmail);

    const code = spy.mock.results[0].value;
    expect(sendEmail).toBeCalledWith(validEmail, code.toString());
  });
});

describe('isOnline', () => {
  it('should should return false if current hour is outside opening hours', () => {
    vi.setSystemTime('2024-01-01 7:49');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:00');
    expect(isOnline()).toBe(false);
  });

  it('should should return true if current hour is within opening hours', () => {
    vi.setSystemTime('2024-01-01 8:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return discount 0.2 on Christmas day', () => {
    vi.setSystemTime('2023-12-25 00:01');
    expect(getDiscount()).toEqual(0.2);

    vi.setSystemTime('2023-12-25 23:59');
    expect(getDiscount()).toEqual(0.2);
  });

  it('should return discount 0 on any other day', () => {
    vi.setSystemTime('2023-12-24 23:59');
    expect(getDiscount()).toEqual(0);
  });

  it('should return discount 0 on any other day', () => {
    vi.setSystemTime('2023-12-26 00:01');
    expect(getDiscount()).toEqual(0);
  });
});
