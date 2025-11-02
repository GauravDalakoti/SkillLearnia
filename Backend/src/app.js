import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import courseRoutes from "./routes/course.route.js"
import curriculamRoutes from "./routes/curriculam.route.js"
import lectureRoutes from "./routes/lecture.routes.js"
import coursePurchase from "./routes/purchaseCourse.route.js"

const app = express()

app.use(cors(
    {
        credentials: true,
        origin: process.env.CORS_ORIGIN,
        allowedHeaders: ["Content-Type", "Authorization"],
        method: ["GET", "POST", "DELETE", "PATCH"]
    }
))

app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

//routers routes
app.use("/api/v1/user", userRoutes)

//coures routes
app.use("/api/v1/course", courseRoutes)

//curriculam routes
app.use("/api/v1/curriculam", curriculamRoutes)

//lecture routes
app.use("/api/v1/lecture", lectureRoutes)

//coursePurchase route
app.use("/api/v1/purchase", coursePurchase)

export { app }