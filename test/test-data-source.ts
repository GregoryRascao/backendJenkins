/*
 *   Copyright (c) 2023
 *   All rights reserved.
 */
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../src/entity/User"
import { Item } from "../src/entity/Item"
import { Basket } from "../src/entity/Basket"
import { BasketItem } from "../src/entity/BasketItem"

export const TestDataSource = new DataSource({
    name: "test",
    type: "sqlite",
    database: "./test/test.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Basket, BasketItem, Item],
    migrations: [],
    subscribers: [],
})



