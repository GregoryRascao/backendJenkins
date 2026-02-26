import { TestDataSource } from '../../src/test-data-source'
import { User } from '../../src/entity/User'
import { Item } from '../../src/entity/Item'
import { Basket } from '../../src/entity/Basket'
import { BasketItem } from '../../src/entity/BasketItem'
import { Repository } from 'typeorm'

describe('Repository Tests with SQLite', () => {
  let userRepository: Repository<User>
  let itemRepository: Repository<Item>
  let basketRepository: Repository<Basket>
  let basketItemRepository: Repository<BasketItem>

  beforeAll(async () => {
    // Initialize test database
    await TestDataSource.initialize()
    userRepository = TestDataSource.getRepository(User)
    itemRepository = TestDataSource.getRepository(Item)
    basketRepository = TestDataSource.getRepository(Basket)
    basketItemRepository = TestDataSource.getRepository(BasketItem)
  })

  afterAll(async () => {
    // Close database connection
    await TestDataSource.destroy()
  })

  afterEach(async () => {
    // Clean up after each test
    await basketItemRepository.delete({})
    await basketRepository.delete({})
    await itemRepository.delete({})
    await userRepository.delete({})
  })

  describe('User Repository', () => {
    test('should create a new user', async () => {
      const user = userRepository.create({
        username: 'testuser',
        useremail: 'test@example.com',
        userdescription: 'A test user',
        userpassword: 'hashedpassword123',
      })

      const savedUser = await userRepository.save(user)

      expect(savedUser.id).toBeDefined()
      expect(savedUser.username).toBe('testuser')
      expect(savedUser.useremail).toBe('test@example.com')
    })

    test('should find user by id', async () => {
      const user = userRepository.create({
        username: 'finduser',
        useremail: 'find@example.com',
        userdescription: 'Find test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const foundUser = await userRepository.findOneBy({ id: savedUser.id })

      expect(foundUser).toBeDefined()
      expect(foundUser?.username).toBe('finduser')
    })

    test('should find user by username', async () => {
      const user = userRepository.create({
        username: 'uniqueuser',
        useremail: 'unique@example.com',
        userdescription: 'Unique test',
        userpassword: 'pass123',
      })
      await userRepository.save(user)

      const foundUser = await userRepository.findOneBy({ username: 'uniqueuser' })

      expect(foundUser).toBeDefined()
      expect(foundUser?.useremail).toBe('unique@example.com')
    })

    test('should update a user', async () => {
      const user = userRepository.create({
        username: 'updateuser',
        useremail: 'update@example.com',
        userdescription: 'Original description',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      savedUser.userdescription = 'Updated description'
      const updatedUser = await userRepository.save(savedUser)

      expect(updatedUser.userdescription).toBe('Updated description')
    })

    test('should delete a user', async () => {
      const user = userRepository.create({
        username: 'deleteuser',
        useremail: 'delete@example.com',
        userdescription: 'Delete test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      await userRepository.remove(savedUser)
      const foundUser = await userRepository.findOneBy({ id: savedUser.id })

      expect(foundUser).toBeNull()
    })
  })

  describe('Item Repository', () => {
    test('should create a new item', async () => {
      const item = itemRepository.create({
        name: 'Test Item',
        price: 99.99,
        quantity: 10,
        description: 'A test item',
      })

      const savedItem = await itemRepository.save(item)

      expect(savedItem.id).toBeDefined()
      expect(savedItem.name).toBe('Test Item')
      expect(savedItem.price).toBe(99.99)
    })

    test('should find item by id', async () => {
      const item = itemRepository.create({
        name: 'Find Item',
        price: 49.99,
        quantity: 5,
        description: 'Find test',
      })
      const savedItem = await itemRepository.save(item)

      const foundItem = await itemRepository.findOneBy({ id: savedItem.id })

      expect(foundItem).toBeDefined()
      expect(foundItem?.name).toBe('Find Item')
    })

    test('should find item by name', async () => {
      const item = itemRepository.create({
        name: 'Unique Item Name',
        price: 25.5,
        quantity: 3,
        description: 'Unique test',
      })
      await itemRepository.save(item)

      const foundItem = await itemRepository.findOneBy({ name: 'Unique Item Name' })

      expect(foundItem).toBeDefined()
      expect(foundItem?.price).toBe(25.5)
    })

    test('should update item quantity', async () => {
      const item = itemRepository.create({
        name: 'Update Item',
        price: 15.0,
        quantity: 20,
        description: 'Update test',
      })
      const savedItem = await itemRepository.save(item)

      savedItem.quantity = 15
      const updatedItem = await itemRepository.save(savedItem)

      expect(updatedItem.quantity).toBe(15)
    })

    test('should get all items', async () => {
      const item1 = itemRepository.create({
        name: 'Item 1',
        price: 10.0,
        quantity: 5,
        description: 'Item 1',
      })
      const item2 = itemRepository.create({
        name: 'Item 2',
        price: 20.0,
        quantity: 10,
        description: 'Item 2',
      })

      await itemRepository.save([item1, item2])
      const allItems = await itemRepository.find()

      expect(allItems.length).toBeGreaterThanOrEqual(2)
    })

    test('should delete an item', async () => {
      const item = itemRepository.create({
        name: 'Delete Item',
        price: 5.0,
        quantity: 1,
        description: 'Delete test',
      })
      const savedItem = await itemRepository.save(item)

      await itemRepository.remove(savedItem)
      const foundItem = await itemRepository.findOneBy({ id: savedItem.id })

      expect(foundItem).toBeNull()
    })
  })

  describe('Basket Repository', () => {
    test('should create a basket for user', async () => {
      const user = userRepository.create({
        username: 'basketuser',
        useremail: 'basketuser@example.com',
        userdescription: 'Basket test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      expect(savedBasket.id).toBeDefined()
      expect(savedBasket.user.id).toBe(savedUser.id)
    })

    test('should find basket by id', async () => {
      const user = userRepository.create({
        username: 'findbasketuser',
        useremail: 'findbasket@example.com',
        userdescription: 'Find basket test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const foundBasket = await basketRepository.findOne({
        where: { id: savedBasket.id },
        relations: ['user'],
      })

      expect(foundBasket).toBeDefined()
      expect(foundBasket?.user.id).toBe(savedUser.id)
    })

    test('should find basket by user', async () => {
      const user = userRepository.create({
        username: 'userbaskettest',
        useremail: 'userbasket@example.com',
        userdescription: 'User basket test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      await basketRepository.save(basket)

      const foundBasket = await basketRepository.findOne({
        where: { user: { id: savedUser.id } },
        relations: ['user'],
      })

      expect(foundBasket).toBeDefined()
      expect(foundBasket?.user.id).toBe(savedUser.id)
    })

    test('should add item to basket', async () => {
      const user = userRepository.create({
        username: 'additemuser',
        useremail: 'additem@example.com',
        userdescription: 'Add item test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item = itemRepository.create({
        name: 'Basket Item 1',
        price: 50.0,
        quantity: 10,
        description: 'Item for basket',
      })
      const savedItem = await itemRepository.save(item)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem,
        quantity: 2,
      })
      await basketItemRepository.save(basketItem)

      const basketWithItems = await basketRepository.findOne({
        where: { id: savedBasket.id },
        relations: ['items', 'items.item'],
      })

      expect(basketWithItems?.items.length).toBe(1)
      expect(basketWithItems?.items[0].item.name).toBe('Basket Item 1')
    })

    test('should update basket items quantity', async () => {
      const user = userRepository.create({
        username: 'updatebasketuser',
        useremail: 'updatebasket@example.com',
        userdescription: 'Update basket test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item = itemRepository.create({
        name: 'Update Basket Item',
        price: 30.0,
        quantity: 20,
        description: 'Update test',
      })
      const savedItem = await itemRepository.save(item)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem,
        quantity: 5,
      })
      const savedBasketItem = await basketItemRepository.save(basketItem)

      savedBasketItem.quantity = 3
      await basketItemRepository.save(savedBasketItem)

      const updatedBasketItem = await basketItemRepository.findOneBy({
        id: savedBasketItem.id,
      })

      expect(updatedBasketItem?.quantity).toBe(3)
    })

    test('should remove item from basket', async () => {
      const user = userRepository.create({
        username: 'removeitemuser',
        useremail: 'removeitem@example.com',
        userdescription: 'Remove item test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item = itemRepository.create({
        name: 'Remove Basket Item',
        price: 40.0,
        quantity: 15,
        description: 'Remove test',
      })
      const savedItem = await itemRepository.save(item)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem,
        quantity: 2,
      })
      const savedBasketItem = await basketItemRepository.save(basketItem)

      await basketItemRepository.remove(savedBasketItem)

      const basketAfterRemove = await basketRepository.findOne({
        where: { id: savedBasket.id },
        relations: ['items'],
      })

      expect(basketAfterRemove?.items.length).toBe(0)
    })

    test('should get empty basket', async () => {
      const user = userRepository.create({
        username: 'emptybasketuser',
        useremail: 'emptybasket@example.com',
        userdescription: 'Empty basket test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const foundBasket = await basketRepository.findOne({
        where: { id: savedBasket.id },
        relations: ['items'],
      })

      expect(foundBasket?.items.length).toBe(0)
    })
  })

  describe('BasketItem Repository', () => {
    test('should create basket item', async () => {
      const user = userRepository.create({
        username: 'basketitemuser',
        useremail: 'basketitem@example.com',
        userdescription: 'Basket item test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item = itemRepository.create({
        name: 'Test Basket Item',
        price: 60.0,
        quantity: 12,
        description: 'Basket item test',
      })
      const savedItem = await itemRepository.save(item)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem,
        quantity: 1,
      })
      const savedBasketItem = await basketItemRepository.save(basketItem)

      expect(savedBasketItem.id).toBeDefined()
      expect(savedBasketItem.quantity).toBe(1)
      expect(savedBasketItem.item.id).toBe(savedItem.id)
    })

    test('should find basket item by id', async () => {
      const user = userRepository.create({
        username: 'findbasketitemuser',
        useremail: 'findbitem@example.com',
        userdescription: 'Find basket item test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item = itemRepository.create({
        name: 'Find Basket Item',
        price: 35.0,
        quantity: 8,
        description: 'Find test',
      })
      const savedItem = await itemRepository.save(item)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem,
        quantity: 3,
      })
      const savedBasketItem = await basketItemRepository.save(basketItem)

      const foundBasketItem = await basketItemRepository.findOne({
        where: { id: savedBasketItem.id },
        relations: ['item', 'basket'],
      })

      expect(foundBasketItem).toBeDefined()
      expect(foundBasketItem?.item.id).toBe(savedItem.id)
    })

    test('should get all basket items for a basket', async () => {
      const user = userRepository.create({
        username: 'multiitembasketuser',
        useremail: 'multiitem@example.com',
        userdescription: 'Multi item test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item1 = itemRepository.create({
        name: 'Multi Item 1',
        price: 20.0,
        quantity: 5,
        description: 'Multi test 1',
      })
      const item2 = itemRepository.create({
        name: 'Multi Item 2',
        price: 30.0,
        quantity: 10,
        description: 'Multi test 2',
      })
      const savedItem1 = await itemRepository.save(item1)
      const savedItem2 = await itemRepository.save(item2)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem1 = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem1,
        quantity: 1,
      })
      const basketItem2 = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem2,
        quantity: 2,
      })
      await basketItemRepository.save([basketItem1, basketItem2])

      const basketItems = await basketItemRepository.find({
        where: { basket: { id: savedBasket.id } },
        relations: ['item'],
      })

      expect(basketItems.length).toBe(2)
    })

    test('should delete basket item', async () => {
      const user = userRepository.create({
        username: 'deletebasketitemuser',
        useremail: 'deletebitem@example.com',
        userdescription: 'Delete basket item test',
        userpassword: 'pass123',
      })
      const savedUser = await userRepository.save(user)

      const item = itemRepository.create({
        name: 'Delete Basket Item',
        price: 45.0,
        quantity: 9,
        description: 'Delete test',
      })
      const savedItem = await itemRepository.save(item)

      const basket = basketRepository.create({
        user: savedUser,
        items: [],
      })
      const savedBasket = await basketRepository.save(basket)

      const basketItem = basketItemRepository.create({
        basket: savedBasket,
        item: savedItem,
        quantity: 2,
      })
      const savedBasketItem = await basketItemRepository.save(basketItem)

      await basketItemRepository.remove(savedBasketItem)
      const foundBasketItem = await basketItemRepository.findOneBy({
        id: savedBasketItem.id,
      })

      expect(foundBasketItem).toBeNull()
    })
  })
})

