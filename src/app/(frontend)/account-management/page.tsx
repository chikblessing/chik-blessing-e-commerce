import type { Metadata } from 'next'
import AccountManagementPage from './page.client'

export const metadata: Metadata = {
  title: 'Account Management | Chik Blessing Global Store',
  description: 'Manage your profile and account settings',
}

export default function Page() {
  return <AccountManagementPage />
}
