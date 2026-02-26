// @ts-nocheck
// Skipped: legacy integration tests replaced by `basket.user.spec.ts`

describe.skip('legacy API integration (skipped)', () => {
  test('placeholder', () => {})
})

function createBasketRepo(baskets = []) {
  return {
    findOne: jest.fn().mockResolvedValue(baskets[0] || { id: 1, user: { id: 1 }, items: [] }),
    findOneBy: jest.fn().mockResolvedValue(baskets[0] || undefined),
    save: jest.fn(),
    update: jest.fn(),
  }
}

describe('API integration (mocked repos) - full scenarios', () => {
  // ...existing tests...
})
