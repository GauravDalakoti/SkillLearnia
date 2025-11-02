import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = asyncHandler(async (req, res) => {

    try {

        const userId = req.user?._id;
        console.log("this is the id", userId);

        const user = await User.findById(userId)
        const { courseId } = req.body

        console.log(courseId);
        

        const course = await Course.findById(courseId);

        if (!course) {

            throw new ApiError(404, "course not found")
        }

        const newPurchase = new CoursePurchase({

            courseId,
            userId,
            amount: course.Pricing,
            status: "pending"
        })

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.courseTitle,
                            images: [course.courseImage],
                        },
                        unit_amount: course.Pricing * 100, // Amount in paise (lowest denomination)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
            cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId.toString(),
            },
            shipping_address_collection: {
                allowed_countries: ["IN"], // Optionally restrict allowed countries
            },
        });

        console.log(session.url);

        if (!session.url) {
            return res
                .status(400)
                .json(new ApiError(400, "Error while creating session "))
        }

        // Save the purchase record
        newPurchase.paymentId = session.id;
        await newPurchase.save();


        return res.status(200)
            .json(new ApiResponse(200, session.url, "course Payment success")); // Return the Stripe checkout URL

    } catch (error) {

        console.log("Error while purchasing the course", error);
    }
})

export const stripeWebhook = asyncHandler(async (req, res) => {
    let event;
  console.log("web hook working");
  
    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        console.log("check session complete is called");

        try {
            const session = event.data.object;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                return res.status(404).json({ message: "Purchase not found" });
            }

            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }

            purchase.status = "completed";

            await purchase.save();

            // Update user's enrolledCourses
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
                { new: true }
            );

            // Update course to add user ID to enrolledStudents
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
                { new: true }
            );

        } catch (error) {
            console.error("Error handling event:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).send();
});

