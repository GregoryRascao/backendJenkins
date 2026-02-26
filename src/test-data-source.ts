/*
 *   Copyright (c) 2023
 *   All rights reserved.
 */
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Item } from "./entity/Item"
import { Basket } from "./entity/Basket"
import { BasketItem } from "./entity/BasketItem"

export const TestDataSource = new DataSource({
    name: "test",
    type: "sqlite",
    database: "../test.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Basket, BasketItem, Item],
    migrations: [],
    subscribers: [],
})

