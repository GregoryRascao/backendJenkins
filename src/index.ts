import * as dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import { app } from "./app"

dotenv.config()

AppDataSource.initialize().then(async () => {
    // start express server
    app.listen(3000);
}).catch(error => console.log(error))
