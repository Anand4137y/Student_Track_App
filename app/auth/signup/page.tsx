"use client"
import SchoolSignUp from '@/app/components/signup/SchoolSignUp'
import StaffSignUp from '@/app/components/signup/StaffSignUp'
import React, { useState } from 'react'

function page() {
  const [showStaffSignUp, setShowStaffSignUp] = useState<boolean>(true);
  return (
    <div>
      {
        showStaffSignUp ?
          <StaffSignUp setShowStaffSignUp={setShowStaffSignUp} /> :
          <SchoolSignUp setShowStaffSignUp={setShowStaffSignUp} />
      }

    </div>
  )
}

export default page
