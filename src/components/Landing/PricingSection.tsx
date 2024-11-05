import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Button } from '../ui/button'

export function PricingSection() {
  return (
    <section id="pricing" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Simple Pricing</h2>
      <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8">
        {[
          {
            title: 'Free',
            price: 'Free',
            features: ['1 course per month', 'Basic AI model', 'Email support'],
          },
          {
            title: 'Basic',
            price: '$9.99',
            features: [
              '3 courses per month',
              'Basic AI model',
              'Email support',
            ],
          },
          {
            title: 'Pro',
            price: '$19.99',
            features: [
              '10 courses per month',
              'Advanced AI model',
              '24/7 support',
              'Custom branding',
            ],
          },
          {
            title: 'Enterprise',
            price: 'Custom',
            features: [
              'Unlimited courses',
              'Cutting-edge AI model',
              'Dedicated account manager',
              'API access',
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
              {plan.title === 'Enterprise' ? 'Contact Us' : 'Get Started'}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
