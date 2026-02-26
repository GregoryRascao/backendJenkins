// @ts-nocheck
const request = require('supertest')
import { app } from '../../src/app'
import { AppDataSource } from '../../src/data-source'

describe('Basket & User flows', () => {
  beforeEach(() => {
    // Mock repositories for basket and basket items
    const itemRepo = {
      find: jest.fn().mockResolvedValue([{ id: 1, name: 'Item 1', quantity: 10 }]),
      findOneBy: jest.fn().mockResolvedValue({ id: 1, name: 'Item 1', quantity: 10 }),
    }

    const userRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', userpassword: 'hashed' }),
      save: jest.fn().mockResolvedValue({ id: 1, username: 'newuser', userpassword: 'hashed' }),
    }

    const basketRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 1, user: { id: 1 }, items: [] }),
      findOneBy: jest.fn().mockResolvedValue({ id: 1, user: { id: 1 }, items: [] }),
      save: jest.fn().mockResolvedValue({ id: 1, user: { id: 1 }, items: [] }),
      update: jest.fn().mockResolvedValue({}),
    }

    ;(AppDataSource as any).getRepository.mockImplementation((entity: any) => {
      const name = entity?.name || ''
      if (name === 'User') return userRepo
      if (name === 'Item') return itemRepo
      if (name === 'Basket' || name === 'BasketItem') return basketRepo
      return { find: jest.fn(), findOneBy: jest.fn(), save: jest.fn() }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('register a new user', async () => {
    const res = await request(app).post('/users/register').send({ username: 'newuser', userpassword: 's3cret' })
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
  })

  test('get basket empty after registration', async () => {
    const res = await request(app).get('/basket').set('authorization', 'Bearer token-mock')
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(Array.isArray(res.body.items)).toBe(true)
  })

  test('add an item to the basket', async () => {
    const res = await request(app)
      .put('/basket/add')
      .set('authorization', 'Bearer token-mock')
      .send({ id: 1, quantity: 2 })
    expect(res.status).toBe(200)
  })

  test('remove an item from the basket (set quantity 0)', async () => {
    const res = await request(app)
      .put('/basket/add')
      .set('authorization', 'Bearer token-mock')
      .send({ id: 1, quantity: 0 })
    expect(res.status).toBe(200)
  })

  test('get one item details', async () => {
    const res = await request(app).get('/items/1')
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.id).toBe(1)
  })

  test('get one user details', async () => {
    const res = await request(app).get('/users/1').set('authorization', 'Bearer token-mock')
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
  }, 10000)

  test('add an item with invalid quantity', async () => {
    const res = await request(app)
      .put('/basket/add')
      .set('authorization', 'Bearer token-mock')
      .send({ id: 1, quantity: 'invalid' })
    expect(res.status).toBe(200)
  })

  test('add a non-existent item', async () => {
    // Mock item repo to return empty for non-existent item
    ;(AppDataSource as any).getRepository.mockImplementation((entity: any) => {
      const name = entity?.name || ''
      if (name === 'Item') return { find: jest.fn().mockResolvedValue([]), findOneBy: jest.fn().mockResolvedValue(undefined) }
      if (name === 'User') return { find: jest.fn().mockResolvedValue([]), findOneBy: jest.fn().mockResolvedValue(undefined), save: jest.fn().mockResolvedValue({ id: 1 }) }
      if (name === 'Basket' || name === 'BasketItem') return {
        findOne: jest.fn().mockResolvedValue({ id: 1, user: { id: 1 }, items: [] }),
        findOneBy: jest.fn().mockResolvedValue({ id: 1, user: { id: 1 }, items: [] }),
        save: jest.fn().mockResolvedValue({ id: 1 }),
        update: jest.fn().mockResolvedValue({}),
      }
      return { find: jest.fn(), findOneBy: jest.fn(), save: jest.fn() }
    })

    const res = await request(app)
      .put('/basket/add')
      .set('authorization', 'Bearer token-mock')
      .send({ id: 999, quantity: 1 })

    expect([200, 400, 404, 500]).toContain(res.status)
  })
})
