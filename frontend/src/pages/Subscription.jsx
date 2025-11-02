import React from 'react'

const Subscription = () => {
  return (
    <div className='min-h-[87vh]'>

      <section class="bg-white dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Pricing Plans for Every Educator
            </h2>
            <p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Choose the plan that suits your teaching style, audience size, and business goals. Scale your online course delivery seamlessly with our LMS.
            </p>
          </div>
          <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">


            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Free</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Build and launch your first course with no upfront cost.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$0</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">

                  ❌ <span> Unlimited course creation</span>
                </li>
                <li class="flex items-center space-x-3">
                  ❌ <span> Basic quizzes & assignments </span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Up to <strong>10 students</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ❌ <span>Email support: <strong>3 months</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ❌ <span>Free updates: <strong>3 months</strong></span>
                </li>
              </ul>
              <a href="#" class="text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900">Free</a>
            </div>

            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Basic</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Ideal for individual instructors and small-scale courses.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$19</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">

                  ✅ <span>Unlimited course creation</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Basic quizzes & assignments</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Up to <strong>100 students</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Email support: <strong>3 months</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Free updates: <strong>3 months</strong></span>
                </li>
              </ul>
              <a href="#" class="text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900">Start Basic</a>
            </div>


            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Pro</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Perfect for teams or professional educators scaling up.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$59</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">
                  ✅ <span>All Basic features</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Advanced analytics & reports</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Up to <strong>1000 students</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Priority support: <strong>12 months</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Free updates: <strong>12 months</strong></span>
                </li>
              </ul>
              <a href="#" class="text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900">Go Pro</a>
            </div>


            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Enterprise</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Built for universities, large institutions & course marketplaces.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$249</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">
                  ✅ <span>All Pro features</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Custom integrations & APIs</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Unlimited students & instructors</span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Dedicated support: <strong>24/7</strong></span>
                </li>
                <li class="flex items-center space-x-3">
                  ✅ <span>Lifetime updates included</span>
                </li>
              </ul>
              <a href="#" class="text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900">Contact Sales</a>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default Subscription