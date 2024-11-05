import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const plans = [
  {
    name: 'Basic',
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    features: [
      '5 AI-generated courses per month',
      'Basic course customization',
      '24/7 AI tutor assistance',
      'Progress tracking',
      'Mobile app access',
    ],
    cta: 'Start Basic Plan',
  },
  {
    name: 'Pro',
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    features: [
      'Unlimited AI-generated courses',
      'Advanced course customization',
      'Priority AI tutor assistance',
      'Detailed analytics and insights',
      'Offline mode',
      'Ad-free experience',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'All Pro features',
      'Custom AI model training',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security features',
    ],
    cta: 'Contact Sales',
  },
]

function Header() {
  const [isAnnual, setIsAnnual] = useState(false)
  return (
    <>
      <section className="text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300"
        >
          Choose the plan that's right for you
        </motion.p>
        <div className="flex items-center justify-center mb-12">
          <span
            className={`mr-3 ${isAnnual ? 'text-gray-500' : 'font-semibold'}`}
          >
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-purple-600"
          />
          <span
            className={`ml-3 ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}
          >
            Annual (Save 20%)
          </span>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            {plan.price === 'Custom' ? (
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
            ) : (
              <p className="text-4xl font-bold mb-6">
                $
                {isAnnual
                  ? plan.annualPrice?.toFixed(2)
                  : plan.monthlyPrice?.toFixed(2)}
                <span className="text-base font-normal">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </p>
            )}
            <ul className="mb-8 flex-grow">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center mb-2">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full">{plan.cta}</Button>
          </motion.div>
        ))}
      </section>
    </>
  )
}

export default Header
