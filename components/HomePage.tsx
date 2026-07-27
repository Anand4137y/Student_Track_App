import React from 'react'
import Header from './Header'
import { getTokenFromCookies } from '@/lib/getToken'
import { redirect } from 'next/navigation';

async function HomePage() {
const token = await getTokenFromCookies();
if(!token) {
    redirect('/auth/login');
}
  return (
    <div>
    </div>
  )
}

export default HomePage
