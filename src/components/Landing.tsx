"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Zap, Clock, Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold">AICoursify</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a
            href="#features"
            className="hover:text-purple-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-purple-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="hover:text-purple-600 transition-colors"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button className="hidden md:inline-flex">Get Started</Button>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg m-4 p-4"
        >
          <nav className="flex flex-col space-y-4">
            <a
              href="#features"
              className="hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-purple-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="hover:text-purple-600 transition-colors"
            >
              Pricing
            </a>
            <Button className="w-full">Get Started</Button>
          </nav>
        </motion.div>
      )}

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Learn Anything, Anytime
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300"
          >
            AI-powered courses generated in real-time, tailored to your
            interests
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4"
          >
            <Input
              type="text"
              placeholder="Enter a topic..."
              className="w-full md:w-96"
            />
            <Button size="lg" className="w-full md:w-auto">
              Generate Course <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </section>

        <section id="features" className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose AICoursify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Generation",
                description: "Get your course materials in seconds, not hours",
              },
              {
                icon: BookOpen,
                title: "Tailored Content",
                description: "Courses adapted to your learning style and pace",
              },
              {
                icon: Clock,
                title: "Learn Anytime",
                description: "Access your personalized courses 24/7",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              {
                step: 1,
                title: "Enter Your Topic",
                description: "Type in any subject you want to learn about",
              },
              {
                step: 2,
                title: "AI Generates Content",
                description: "Our AI creates a tailored course in seconds",
              },
              {
                step: 3,
                title: "Start Learning",
                description: "Access your personalized course immediately",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Simple Pricing
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8">
            {[
              {
                title: "Basic",
                price: "$9.99",
                features: [
                  "5 courses per month",
                  "Basic AI model",
                  "Email support",
                ],
              },
              {
                title: "Pro",
                price: "$19.99",
                features: [
                  "Unlimited courses",
                  "Advanced AI model",
                  "24/7 support",
                  "Custom branding",
                ],
              },
              {
                title: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited courses",
                  "Cutting-edge AI model",
                  "Dedicated account manager",
                  "API access",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full md:w-80 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                  <p className="text-4xl font-bold mb-6">{plan.price}</p>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 text-purple-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full">
                  {plan.title === "Enterprise" ? "Contact Us" : "Get Started"}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Join thousands of learners who are already benefiting from
            AI-powered education.
          </p>
          <Button size="lg">
            Start Your Learning Journey <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">AICoursify</span>
          </div>
          <nav className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="hover:text-purple-600 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Careers
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
