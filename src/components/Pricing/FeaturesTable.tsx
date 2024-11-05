import { Check, HelpCircle, X } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const featureComparison = [
  {
    feature: 'AI-generated courses',
    basic: '5 per month',
    pro: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Course customization',
    basic: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced',
  },
  {
    feature: 'AI tutor assistance',
    basic: '24/7',
    pro: 'Priority 24/7',
    enterprise: 'Dedicated AI',
  },
  { feature: 'Progress tracking', basic: true, pro: true, enterprise: true },
  { feature: 'Mobile app access', basic: true, pro: true, enterprise: true },
  { feature: 'Offline mode', basic: false, pro: true, enterprise: true },
  {
    feature: 'Analytics and insights',
    basic: 'Basic',
    pro: 'Detailed',
    enterprise: 'Advanced',
  },
  {
    feature: 'Ad-free experience',
    basic: false,
    pro: true,
    enterprise: true,
  },
  { feature: 'API access', basic: false, pro: false, enterprise: true },
  {
    feature: 'Custom AI model training',
    basic: false,
    pro: false,
    enterprise: true,
  },
  {
    feature: 'Dedicated account manager',
    basic: false,
    pro: false,
    enterprise: true,
  },
  {
    feature: 'Custom integrations',
    basic: false,
    pro: false,
    enterprise: true,
  },
  {
    feature: 'Advanced security features',
    basic: false,
    pro: false,
    enterprise: true,
  },
]

function FeaturesTable() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Compare Plans</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Feature</TableHead>
              <TableHead>Basic</TableHead>
              <TableHead>Pro</TableHead>
              <TableHead>Enterprise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featureComparison.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.feature}</TableCell>
                <TableCell>{renderFeatureValue(row.basic)}</TableCell>
                <TableCell>{renderFeatureValue(row.pro)}</TableCell>
                <TableCell>{renderFeatureValue(row.enterprise)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export default FeaturesTable

function renderFeatureValue(value: boolean | string) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-500" />
    ) : (
      <X className="w-5 h-5 text-red-500" />
    )
  }
  if (value === 'Basic' || value === 'Advanced' || value === 'Detailed') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center">
              {value} <HelpCircle className="w-4 h-4 ml-1 text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipContent(value)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return value
}

function getTooltipContent(value: string) {
  switch (value) {
    case 'Basic':
      return 'Essential features to get you started'
    case 'Advanced':
      return 'Enhanced features for power users'
    case 'Detailed':
      return 'Comprehensive analytics and reporting'
    default:
      return ''
  }
}
