// @ts-nocheck
import { ItemController } from '../../src/controller/ItemController'
import { AppDataSource } from '../../src/data-source'

describe('ItemController', () => {
  let itemController: ItemController
  const mockFind = jest.fn()
  const mockFindOneBy = jest.fn()

  beforeAll(() => {
    // mock repository returned by AppDataSource.getRepository
    ;(AppDataSource as any).getRepository.mockImplementation(() => ({
      find: mockFind,
      findOneBy: mockFindOneBy,
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }))
    itemController = new ItemController()
  })

  beforeEach(() => {
    mockFind.mockReset()
    mockFindOneBy.mockReset()
  })

  test('all() returns array of items', async () => {
    const items = [{ id: 1, name: 'Item 1' }]
    mockFind.mockResolvedValue(items)

    const result = await itemController.all({} as any, {} as any, {} as any)
    expect(result).toEqual(items)
    expect(mockFind).toHaveBeenCalled()
  })

  test('one() returns single item by id', async () => {
    const item = { id: 2, name: 'Item 2' }
    mockFindOneBy.mockResolvedValue(item)

    const req: any = { params: { id: 2 } }
    const result = await itemController.one(req, {} as any, {} as any)

    expect(result).toEqual(item)
    expect(mockFindOneBy).toHaveBeenCalledWith({ id: req.params.id })
  })

  test('one() returns undefined when not found', async () => {
    mockFindOneBy.mockResolvedValue(undefined)
    const req: any = { params: { id: 99 } }
    const result = await itemController.one(req, {} as any, {} as any)
    expect(result).toBeUndefined()
  })
})
