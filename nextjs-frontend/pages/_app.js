// import Layout from '../components/Layout'
// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

// /pages/_app.js
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import React from 'react'
import App from 'next/app'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    const Layout = Component.layout || (children => <>{children}</>)

    return (
      <Layout>
        <Component {...pageProps}></Component>
      </Layout>
    )
  }
}

export default MyApp
