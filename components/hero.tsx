"use client";

import React from "react";
import { motion, Variants, cubicBezier } from "framer-motion";

interface TestimonialCardProps {
  name?: string;
  role: string;
  company?: string;
  quote: string;
  image: string;
  logo: string;
  results: {
    metric1: string;
    metric1Description: string;
    metric2: string;
    metric2Description: string;
  };
  bgColor: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  quote,
  image,
  logo,
  results,
  bgColor,
}) => {
  return (
    <div
      className={`${bgColor} rounded-3xl p-8 lg:p-10 h-full flex flex-col shadow-lg`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <img
            src={logo}
            alt={company || name}
            className="w-10 h-10 object-contain"
          />
        </div>
        <h3 className="text-white text-xl lg:text-2xl font-semibold">
          {name || company}
        </h3>
      </div>

      <blockquote className="text-white text-lg lg:text-xl leading-relaxed mb-8 flex-grow">
        “{quote}”
      </blockquote>

      <div className="text-white/80 text-sm mb-6">{role}</div>

      <div className="border-t border-white/20 pt-6">
        <div className="text-white/70 text-sm font-medium mb-4">Results</div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-white text-3xl lg:text-4xl font-bold mb-1">
              {results.metric1}
            </div>
            <div className="text-white/70 text-sm">
              {results.metric1Description}
            </div>
          </div>
          <div>
            <div className="text-white text-3xl lg:text-4xl font-bold mb-1">
              {results.metric2}
            </div>
            <div className="text-white/70 text-sm">
              {results.metric2Description}
            </div>
          </div>
        </div>
      </div>
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
        "One of the main advantages of posting jobs on Devtask is the skill level of the applicants. Some of the best talents in our team were found here.",
      image: "/api/placeholder/56/56",
      logo: "https://cdn.prod.website-files.com/66f2f083f5b8de8e38f75505/66f2f083f5b8de8e38f75551_company-05.png",
      results: {
        metric1: "3-4x faster",
        metric1Description: "time-to-hire",
        metric2: "+30",
        metric2Description: "key hires made",
      },
      bgColor: "bg-slate-800",
    },
    {
      name: "Tommy Abha",
      role: "iOS Developer at RockCode",
      company: "",
      quote:
        "Using Devtalk led me to amazing freelancing gigs and ultimately to a dream job at a major tech company.",
      image: "/api/placeholder/56/56",
      logo: "https://cdn.prod.website-files.com/66f2f083f5b8de8e38f75505/66f2f083f5b8de8e38f75552_tommy.png",
      results: {
        metric1: "+40",
        metric1Description: "successful gigs",
        metric2: "1",
        metric2Description: "dream job landed",
      },
      bgColor: "bg-teal-800",
    },
  ];

  return (
    <section className="min-h-screen bg-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
            The #1 job board for
            <br />
            software development
          </h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
