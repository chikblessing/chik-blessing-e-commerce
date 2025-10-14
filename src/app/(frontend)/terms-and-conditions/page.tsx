import type { Metadata } from 'next'
import TermsClient from './page.client'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Chik Blessing Global Limited',
  description:
    'General Terms and Conditions of Use for E-commerce for Buyers and Chik Blessing Global Limited',
}

export default function TermsAndConditionsPage() {
  return <TermsClient />
}
