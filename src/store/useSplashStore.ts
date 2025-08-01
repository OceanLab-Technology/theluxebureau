// // stores/useSplashStore.ts
// import { create } from 'zustand'

// type SplashState = {
//   isShowing: boolean
//   show: () => void
//   hide: () => void
//   runSplash: (fn: () => Promise<any>) => Promise<void>
//   stopSplash: () => void
// }

// export const useSplashStore = create<SplashState>((set) => ({
//   isShowing: false,

//   show: () => set({ isShowing: true }),
//   hide: () => set({ isShowing: false }),

//   stopSplash: () => set({ isShowing: false }),

//   runSplash: async (fn) => {
//     set({ isShowing: true })
//     try {
//       await fn()
//     } finally {
//       setTimeout(() => set({ isShowing: false }), 500) // optional fade-out delay
//     }
//   },
// }))


import { create } from 'zustand'

type SplashState = {
  isShowing: boolean
  show: () => void
  hide: () => void
  runSplash: (fn: () => Promise<any>) => Promise<void>
  stopSplash: () => void
}

export const useSplashStore = create<SplashState>((set) => ({
  isShowing: false,
  show: () => set({ isShowing: true }),
  hide: () => set({ isShowing: false }),
  stopSplash: () => set({ isShowing: false }),
  runSplash: async (fn) => {
    set({ isShowing: true })
    try {
      await fn()
    } finally {
      // Use a small delay for smoother UX
      setTimeout(() => set({ isShowing: false }), 300)
    }
  }
}))
