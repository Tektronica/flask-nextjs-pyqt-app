// import Layout from '../components/Layout'
// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

// /pages/_app.js
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import React from 'react'
import App from 'next/app'

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
