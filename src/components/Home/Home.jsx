import React from 'react'
import CalorieCalculator from '../CalorieCalculator/CalorieCalculator'
import Mainslider from '../Mainslider/Mainslider'
import About from '../About/About'
import Loader from '../Loader/Loader';


const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    text: "This website has completely transformed my fitness journey. The trainers are exceptional and the community is so supportive. I've achieved results I never thought possible!"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Professional Athlete",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    text: "The nutrition guidance and personalized training programs have taken my performance to the next level. Highly recommend for both beginners and advanced athletes."
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Yoga Practitioner",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    text: "The variety of classes and expert instructors make every session enjoyable. It's more than just a gym - it's a welcoming community focused on holistic wellness."
  }
];


export default function Home() {
  return (<>
     <Mainslider />
      <div className="container m-auto">
        <About />
        <CalorieCalculator />
        
        {/* Testimonials Section */}
        <section className="py-12 rounded-xl my-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                What Our Members Say
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Don't just take our word for it - hear from our amazing community
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-6 transform transition duration-500 hover:scale-105"
                >
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="mt-4">
                    <p className="text-base text-gray-600 italic">
                      "{testimonial.text}"
                    </p>
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="/trainers"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#ff4857] to-[#ffb404] hover:opacity-90"
                >
                  Start Your Journey Today
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
  </>)
}