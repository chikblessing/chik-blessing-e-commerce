import type { Metadata } from 'next'
import PrivacyClient from './page.client'

export const metadata: Metadata = {
  title: 'Privacy Policy | Chik Blessing Global Limited',
  description:
    'Privacy Policy for Chik Blessing Global Limited - Learn how we collect, use, and protect your personal information in compliance with NDPA 2023',
}

export default function PrivacyPolicyPage() {
  return <PrivacyClient />
}
