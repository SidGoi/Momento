import Link from 'next/link'
import React from 'react'

const BackgroundsPage = () => {
  return (
    <div>
      <h1>Backgrounds</h1>
      <Link href="/admin/background/create">Add New</Link>
    </div>
  )
}

export default BackgroundsPage
