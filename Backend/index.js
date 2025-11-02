import { dbConnection } from "./src/db/dbConnect.js";
import { app } from "./src/app.js";
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })

dbConnection()
    .then(() => {

        app.on("error", (error) => {

            console.log("ERORR:", error)
            throw error
        })

        app.get("/", (req, res) => {

            res.send("hello server running")
        })

        app.listen(process.env.PORT || 8000, () => {

            console.log(`Server is running at port http://localhost:${process.env.PORT}`)
        })
    })
    .catch((error) => {

        console.log("MONGO db connection failed !!!", error)
    })