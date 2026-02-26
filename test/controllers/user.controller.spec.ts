// @ts-nocheck
import { UserController } from '../../src/controller/UserController'
import { AppDataSource } from '../../src/data-source'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('UserController', () => {
  let userController: UserController
  const mockFind = jest.fn()
  const mockFindOneBy = jest.fn()
  const mockSave = jest.fn()
  const mockUpdate = jest.fn()

  beforeAll(() => {
    ;(AppDataSource as any).getRepository.mockImplementation(() => ({
      find: mockFind,
      findOneBy: mockFindOneBy,
      save: mockSave,
      update: mockUpdate,
      remove: jest.fn()
    }))
    userController = new UserController()
  })

  beforeEach(() => {
    mockFind.mockReset()
    mockFindOneBy.mockReset()
    mockSave.mockReset()
    mockUpdate.mockReset()
    ;(bcrypt.genSalt as jest.Mock).mockReset()
    ;(bcrypt.hash as jest.Mock).mockReset()
    ;(bcrypt.compare as jest.Mock).mockReset()
    ;(jwt.sign as jest.Mock).mockReset()
  })

  test('save() hashes password and saves user', async () => {
    const user = { username: 'u', userpassword: 'pass' }
    const plain = user.userpassword
    ;(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt')
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed')
    mockSave.mockResolvedValue({ id: 1, ...user, userpassword: 'hashed' })

    const req: any = { body: user }
    const result = await userController.save(req, {} as any, {} as any)

    expect(mockSave).toHaveBeenCalled()
    expect((bcrypt.hash as jest.Mock)).toHaveBeenCalledWith(plain, 'salt')
  })

  test('login() returns token on correct credentials', async () => {
    const user = { id: 1, username: 'u', userpassword: 'hashed' }
    mockFindOneBy.mockResolvedValue(user)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(jwt.sign as jest.Mock).mockReturnValue('token-123')

    const req: any = { body: { username: 'u', userpassword: 'pass' } }
    const res: any = { json: jest.fn() }

    await userController.login(req, res, {} as any)

    expect(mockFindOneBy).toHaveBeenCalledWith({ username: 'u' })
    expect((bcrypt.compare as jest.Mock)).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({ success: true, token: 'token-123' })
  })

  test('login() fails on wrong password', async () => {
    const user = { id: 1, username: 'u', userpassword: 'hashed' }
    mockFindOneBy.mockResolvedValue(user)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    const req: any = { body: { username: 'u', userpassword: 'bad' } }
    const res: any = { json: jest.fn() }

    await userController.login(req, res, {} as any)

    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'bad username and or password' })
  })

})
