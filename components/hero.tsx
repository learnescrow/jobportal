"use client";

import React, { useState } from "react";
import { motion, Variants, cubicBezier } from "framer-motion";

interface TestimonialCardProps {
  name?: string;
  role: string;
  company?: string;
  quote: string;
  image: string;
  logo: string;
  bgColor: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  quote,
  image,
  logo,
  bgColor,
}) => {
  return (
    <div
      className={`bg-[#FCFBFD] rounded-3xl p-8 lg:p-10 h-full flex flex-col border-2 border-gray-100`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <img
            src={logo}
            alt={company || name}
            className="w-10 h-10 object-contain"
          />
        </div>
        <h3 className="text-black text-xl lg:text-2xl font-semibold">
          {name || company}
        </h3>
      </div>

      <blockquote className="text-black text-lg lg:text-xl leading-relaxed flex-grow">
        “{quote}”
      </blockquote>

      <div className="text-black/80 text-sm mt-6">{role}</div>
    </div>
  );
};

// Animation Config
const easeCurve = cubicBezier(0.22, 1, 0.36, 1);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeCurve,
    },
  },
};

const Hero: React.FC = () => {
  const testimonials: TestimonialCardProps[] = [
    {
      name: "",
      role: "John Wick, CTO",
      company: "Company XYZ",
      quote:
        "One of the main advantages of posting jobs on Devtask is the skill level of the applicants.",
      image: "/api/placeholder/56/56",
      logo: "https://cdn.prod.website-files.com/66f2f083f5b8de8e38f75505/66f2f083f5b8de8e38f75551_company-05.png",
      bgColor: "bg-slate-800",
    },
    {
      name: "Tommy Abha",
      role: "iOS Developer at RockCode",
      company: "",
      quote:
        "Using Devtalk led me to amazing freelancing gigs and ultimately a dream job.",
      image: "/api/placeholder/56/56",
      logo: "https://cdn.prod.website-files.com/66f2f083f5b8de8e38f75505/66f2f083f5b8de8e38f75552_tommy.png",
      bgColor: "bg-teal-800",
    },
    {
      name: "Sarah Kim",
      role: "Product Manager at TechHive",
      quote:
        "A truly game-changing platform. We scaled our hiring pipeline faster than ever.",
      image: "/api/placeholder/56/56",
      logo: "https://cdn.prod.website-files.com/66f2f083f5b8de8e38f75505/66f2f083f5b8de8e38f75551_company-05.png",
      bgColor: "bg-purple-700",
    },
    {
      name: "Arjun Mehta",
      role: "Full Stack Developer",
      quote:
        "Found meaningful opportunities and long-term collaborations. Highly recommend.",
      image: "/api/placeholder/56/56",
      logo: "https://cdn.prod.website-files.com/66f2f083f5b8de8e38f75505/66f2f083f5b8de8e38f75552_tommy.png",
      bgColor: "bg-indigo-800",
    },
  ];

  return (
    <section className=" bg-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl  font-bold text-gray-900 leading-tight">
            Testimonials
          </h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="snap-center flex-shrink-0 w-[70%] sm:w-[45%] lg:w-[30%]">
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
