import { send } from 'vite'
import { it, expect, describe, vi } from 'vitest'

describe('test suit', () => {
  it('test case', () => {
      const sendText = vi.fn()
      sendText.mockImplementation((message) => 'ok')
      const text = "message";
      expect(sendText(text)).toEqual('ok')
      expect(sendText).toHaveBeenCalledWith(text)
      expect(sendText).toHaveBeenCalled(1)

  })
})
