// Mock native modules and AppDataSource early

jest.mock('bcrypt', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashed'),
    compare: jest.fn().mockResolvedValue(true)
}))

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('token-mock'),
    verify: jest.fn((token: any, secret: any, cb: any) => cb(null, { user: { id: 1 } }))
}))

jest.mock('../src/data-source', () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue(true),
        getRepository: jest.fn()
    }
}))

// Global test setup

// Ensure tests can mock AppDataSource before controllers import it
;(global as any).__TEST__ = true
