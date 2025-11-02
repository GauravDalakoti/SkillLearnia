import { Star, Clock, Users, ShieldCheck } from "lucide-react";

const StatsSection = () => {
  const features = [
    {
      icon: <Star className="text-blue-600 w-8 h-8" />,
      title: "Expert Instructors",
      desc: "Learn from experienced mentors and industry professionals.",
    },
    {
      icon: <Clock className="text-blue-600 w-8 h-8" />,
      title: "Flexible Learning",
      desc: "Access your courses anytime, anywhere, on any device.",
    },
    {
      icon: <Users className="text-blue-600 w-8 h-8" />,
      title: "Community Support",
      desc: "Join a thriving learner community and collaborate together.",
    },
    {
      icon: <ShieldCheck className="text-blue-600 w-8 h-8" />,
      title: "Verified Certificates",
      desc: "Earn industry-recognized certificates upon completion.",
    },
  ];

  const testimonials = [
    {
      name: "Aarav Sharma",
      text: "This platform helped me transition into data science with ease. The mentors are great!",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Mehta",
      text: "Beautiful UI, interactive lessons, and super clear explanations. Highly recommend!",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Rohit Verma",
      text: "The courses are top-notch and the pace is perfect. Worth every rupee!",
      img: "https://randomuser.me/api/portraits/men/18.jpg",
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Enrolled" },
    { number: "120+", label: "Courses Available" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "500+", label: "Certified Mentors" },
  ];

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {/* ---------- WHY CHOOSE US ---------- */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-6 sm:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Why Choose <span className="text-blue-600">Us</span>?
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            We provide high-quality learning experiences designed to help you succeed in your career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm mt-2 text-center">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="bg-white py-16 px-6 sm:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            What Our Students Say
          </h2>
          <p className="text-gray-600 mt-3">
            Hear from learners who have grown with us
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300"
            >
              <p className="text-gray-700 italic leading-relaxed">“{t.text}”</p>
              <div className="flex items-center gap-3 mt-5">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{t.name}</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ACHIEVEMENTS ---------- */}
      <section className="bg-gray-50 py-16 px-6 sm:px-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Our Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="text-4xl font-extrabold text-blue-600 animate-pulse">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StatsSection;
