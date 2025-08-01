// 'use client'

// import { usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import SplashScreen from './SplashScreen'
// import Header from './Tools/Header'
// import { Footer } from './Tools/Footer'
// import PageWrapper from './PageWrapper'

// export default function TransitionLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()
//   const [isTransitioning, setIsTransitioning] = useState(false)

//   useEffect(() => {
//     setIsTransitioning(true)

//     const timeout = setTimeout(() => {
//       setIsTransitioning(false)
//     }, 1200) // splash screen duration per route

//     return () => clearTimeout(timeout)
//   }, [pathname])

//   return (
//     <>
//       {isTransitioning && <SplashScreen key="splash" />}
//       {!isTransitioning && (
//         <>
//           <Header />
//           <main className="pt-16">
//             <AnimatePresence mode="wait">
//               <PageWrapper key={pathname}>{children}</PageWrapper>
//             </AnimatePresence>
//           </main>
//           <Footer />
//         </>
//       )}
//     </>
//   )
// }


// 'use client'

// import { useEffect, useState } from 'react'
// import { usePathname } from 'next/navigation'
// import SplashScreen from './SplashScreen'
// import Header from './Tools/Header'
// import { Footer } from './Tools/Footer'
// import PageWrapper from './PageWrapper'
// import { AnimatePresence } from 'framer-motion'

// export default function TransitionLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()
//   const [showSplash, setShowSplash] = useState(false)

//   useEffect(() => {
//     setShowSplash(true)
//     const timeout = setTimeout(() => {
//       setShowSplash(false)
//     }, 1000) // adjust duration as needed

//     return () => clearTimeout(timeout)
//   }, [pathname]) // runs on every route change

//   return (
//     <>
//       {showSplash ? (
//         <SplashScreen key="splash" />
//       ) : (
//         <>
//           <Header />
//           <main className="pt-16">
//             <AnimatePresence mode="wait">
//               <PageWrapper key={pathname}>{children}</PageWrapper>
//             </AnimatePresence>
//           </main>
//           <Footer />
//         </>
//       )}
//     </>
//   )
// }



// 'use client'

// import { useSplashStore } from '@/store/useSplashStore'
// import SplashScreen from './SplashScreen'
// import Header from './Tools/Header'
// import { Footer } from './Tools/Footer'
// import { usePathname } from 'next/navigation'
// import PageWrapper from './PageWrapper'
// import { AnimatePresence } from 'framer-motion'

// export default function TransitionLayout({ children }: { children: React.ReactNode }) {
//   const { isShowing } = useSplashStore()
//   const pathname = usePathname()

//   return (
//     <>
//       {isShowing && <SplashScreen />}
//       {!isShowing && (
//         <>
//           <Header />
//           <main className="pt-16">
//             <AnimatePresence mode="wait">
//               <PageWrapper key={pathname}>{children}</PageWrapper>
//             </AnimatePresence>
//           </main>
//           <Footer />
//         </>
//       )}
//     </>
//   )
// }


// 'use client'

// import { useEffect } from 'react'
// import { useSplashStore } from '@/store/useSplashStore'
// import SplashScreen from './SplashScreen'
// import Header from './Tools/Header'
// import { Footer } from './Tools/Footer'
// import { usePathname } from 'next/navigation'
// import PageWrapper from './PageWrapper'
// import { AnimatePresence } from 'framer-motion'

// export default function TransitionLayout({ children }: { children: React.ReactNode }) {
//   const { isReady } = useSplashStore()
//   const pathname = usePathname()

//   return (
//     <>
//       {!isReady ? (
//         <SplashScreen />
//       ) : (
//         <>
//           <Header />
//           <main className="pt-16">
//             <AnimatePresence mode="wait">
//               <PageWrapper key={pathname}>{children}</PageWrapper>
//             </AnimatePresence>
//           </main>
//           <Footer />
//         </>
//       )}
//     </>
//   )
// }


'use client'

import { useSplashStore } from '@/store/useSplashStore'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from './Tools/Header'
import { Footer } from './Tools/Footer'
import PageWrapper from './PageWrapper'

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  const { isShowing } = useSplashStore()
  const pathname = usePathname()

  return (
    <>
      {isShowing}
      {!isShowing && (
        <>
          <Header />
          <main className="pt-16">
            <AnimatePresence mode="wait">
              <PageWrapper key={pathname}>{children}</PageWrapper>
            </AnimatePresence>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
