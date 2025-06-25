import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import img7 from "../../assets/images/img7.jpg"
import trial from "../../assets/images/trial.webp"
import img6 from "../../assets/images/img6.jpg"

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-10 bottom-10 z-20 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-[#F25454] text-white rounded-full transition-all duration-300 border border-white/30"
    aria-label="Next slide"
  >
    <i className="fa-solid fa-chevron-right text-2xl" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-28 bottom-10 z-20 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-[#F25454] text-white rounded-full transition-all duration-300 border border-white/30"
    aria-label="Previous slide"
  >
    <i className="fa-solid fa-chevron-left text-2xl" />
  </button>
);

const slides = [
  {
    image: trial,
    heading: "SHAPE",
    subtitle: "Your Body Today",
    description:
      "Prioritize your health, it's the most valuable asset you have.",
    cta: "Join Us Now",
  },
  {
    image: img7,
    heading: "ACHIEVE",
    subtitle: "Your Fitness Goals",
    description:
      "Push your limits and achieve the extraordinary. Every day is an opportunity to become stronger.",
    cta: "Start Training",
  },
  {
    image: img6,
    heading: "TRANSFORM",
    subtitle: "Your Life Today",
    description:
      "Transform your body, transform your life. Your journey to greatness starts here.",
    cta: "Get Started",
  },
];

const socialLinks = [
  { icon: "fa-facebook-f", url: "#" },
  { icon: "fa-instagram", url: "#" },
  { icon: "fa-twitter", url: "#" },
];

export default function MainSlider() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        fade: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="relative">
            <Slider {...settings} className="overflow-hidden">
                {slides.map((slide, idx) => (
                    <div key={idx} className="relative w-full h-screen">
                        {/* Background Image */}
                        <img
                            src={slide.image}
                            className="w-full h-full object-cover absolute inset-0"
                            alt="slide background"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 z-10" />
                        {/* Large Transparent Text */}
                        <div className="absolute inset-0 flex items-center z-20">
                            <span className="hidden md:block text-[10vw] font-extrabold text-white/10 select-none ml-10 tracking-tight uppercase font-montserrat">
                                FITNESS
                            </span>
                        </div>
                        {/* Content */}
                        <div className="relative z-30 flex flex-col justify-center h-full pl-8 md:pl-24 max-w-2xl">
                            <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-none tracking-tight font-montserrat animate-fade-in">
                                {slide.heading}
                            </h1>
                            <h2 className="text-2xl md:text-4xl font-medium text-white/90 mt-2 mb-6 font-montserrat animate-fade-in-delay">
                                {slide.subtitle}
                            </h2>
                            <button className="w-fit px-6 py-2 bg-[#F25454] hover:bg-[#d43d3d] text-white font-semibold text-lg rounded transition-all duration-300 shadow-lg mb-8 animate-fade-in-delay-2">
                                {slide.cta}
                            </button>
                            <p className="text-white/80 text-base md:text-lg font-light mb-0 animate-fade-in-delay-2">
                                {slide.description}
                            </p>
                        </div>
                        {/* Social Icons */}
                        <div className="hidden md:flex flex-col gap-6 absolute right-10 top-1/2 -translate-y-1/2 z-40">
                            {socialLinks.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.url}
                                    className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-[#F25454] text-white rounded-full transition-all duration-300 text-xl border border-white/20"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className={`fa-brands ${s.icon}`} />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

