// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import { Product } from '@/app/api/types'

// export interface personaliseFormData {
//   yourName: string
//   recipientName: string
//   recipientAddress: string
//   recipientPhone: string
//   recipientEmail: string
//   deliveryDate: string
//   preferredDeliveryTime: string
//   selectedFont: string
//   headerText: string
//   selectedQuote: string
//   customMessage: string
//   smsUpdates: 'send-to-me' | 'send-to-recipient'
//   shippingUpdateMethod: "text-message" | "email" 
// }

// interface PersonaliseState {
//   currentStep: number
//   formData: personaliseFormData
//   selectedProduct: Product | null
//   setStep: (step: number) => void
//   nextStep: () => void
//   prevStep: () => void
//   updateFormData: (data: Partial<personaliseFormData>) => void
//   setSelectedProduct: (product: Product) => void
//   resetCheckout: () => void
//   loadExistingData: (data: personaliseFormData, product: Product) => void
//   validateStep: (step: number) => boolean
//   isStepValid: (step: number) => boolean
// }

// const initialFormData: personaliseFormData = {
//   yourName: '',
//   recipientName: '',
//   recipientAddress: '',
//   recipientPhone: '',
//   recipientEmail: '',
//   deliveryDate: '',
//   preferredDeliveryTime: '',
//   headerText: 'Header',
//   selectedQuote: '',
//   customMessage: '',
//   selectedFont: 'default',
//   smsUpdates: 'send-to-me',
//   shippingUpdateMethod: "text-message"
// }

// // Helper validation functions
// const isValidEmail = (email: string) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// const isValidPhone = (phone: string) =>
//   /^\+?\d{5,15}$/.test(phone.replace(/\s/g, ""))

// export const usePersonaliseStore = create<PersonaliseState>()(
//   persist(
//     (set, get) => ({
//       currentStep: 1,
//       formData: initialFormData,
//       selectedProduct: null,

//       setStep: (step: number) => 
//         set({ currentStep: Math.max(1, Math.min(4, step)) }),

//       nextStep: () => {
//         const { currentStep } = get()
//         if (currentStep < 4) {
//           set({ currentStep: currentStep + 1 })
//         }
//       },

//       prevStep: () => {
//         const { currentStep } = get()
//         if (currentStep > 1) {
//           set({ currentStep: currentStep - 1 })
//         }
//       },

//       updateFormData: (data: Partial<personaliseFormData>) =>
//         set((state) => ({
//           formData: { ...state.formData, ...data }
//         })),

//       setSelectedProduct: (product: Product) =>
//         set({ selectedProduct: product }),

//       resetCheckout: () =>
//         set({ currentStep: 1, formData: initialFormData, selectedProduct: null }),

//       loadExistingData: (data: personaliseFormData, product: Product) =>
//         set({ currentStep: 1, formData: data, selectedProduct: product }),

//       validateStep: (step: number) => {
//         const { formData } = get()

//         switch (step) {
//         case 1: 
//         return !!(
//           formData.yourName?.trim() &&
//           formData.recipientName?.trim() &&

//           formData.recipientPhone?.trim() &&
//           formData.recipientEmail?.trim() &&
//           isValidPhone(formData.recipientPhone) &&
//           isValidEmail(formData.recipientEmail)
//         )

//           case 2: // Personalization Step
//             return !!(
//               formData.headerText?.trim() &&
//               formData.selectedFont &&
//               (formData.customMessage?.trim() || formData.selectedQuote?.trim())
//             )

//           case 3: // Delivery Details Step
//             return !!(
//               formData.deliveryDate &&
//               formData.preferredDeliveryTime &&
//               formData.smsUpdates
//             )

//           case 4: // Summary Step - all previous steps should be valid
//             return (
//               get().validateStep(1) &&
//               get().validateStep(2) &&
//               get().validateStep(3)
//             )

//           default:
//             return false
//         }
//       },

//       isStepValid: (step: number) => {
//         return get().validateStep(step)
//       }
//     }),
//     {
//       name: 'checkout-storage',
//       partialize: (state) => ({ 
//         currentStep: state.currentStep, 
//         formData: state.formData,
//         selectedProduct: state.selectedProduct
//       })
//     }
//   )
// )

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/app/api/types'

export interface personaliseFormData {
  yourName: string
  recipientName: string
  recipientAddress: string
  recipientPhone: string
  recipientEmail: string
  deliveryDate: string
  preferredDeliveryTime: string
  selectedFont: string
  headerText: string
  selectedQuote: string
  customMessage: string
  smsUpdates: 'send-to-me' | 'send-to-recipient'
  shippingUpdateMethod: "text-message" | "email"
}

type ProductWithVariant = Product & { selectedVariant?: string };

interface PersonaliseState {
  currentStep: number
  formData: personaliseFormData
  selectedProduct: ProductWithVariant | null
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<personaliseFormData>) => void
  resetCheckout: () => void
  loadExistingData: (data: personaliseFormData, product: Product) => void
  validateStep: (step: number) => boolean
  isStepValid: (step: number) => boolean
  printSnapshot: (label?: string) => void
  setSelectedProduct: (product: ProductWithVariant) => void;
}

const initialFormData: personaliseFormData = {
  yourName: '',
  recipientName: '',
  recipientAddress: '',
  recipientPhone: '',
  recipientEmail: '',
  deliveryDate: '',
  preferredDeliveryTime: '',
  headerText: 'Header',
  selectedQuote: '',
  customMessage: '',
  selectedFont: 'default',
  smsUpdates: 'send-to-me',
  shippingUpdateMethod: "text-message"
}

// Helper validation functions
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isValidPhone = (phone: string) =>
  /^\+?\d{5,15}$/.test(phone.replace(/\s/g, ""))

export const usePersonaliseStore = create<PersonaliseState>()(
  persist(
    (set, get) => {
      // centralised logger so we can call it after any state change
      const log = (label = 'Step update') => {
        const s = get()
        const validity = {
          step1: s.validateStep(1),
          step2: s.validateStep(2),
          step3: s.validateStep(3),
          step4: s.validateStep(4),
        }
        // Pretty console output
        console.groupCollapsed(
          `%c[Personalise]%c ${label} → step ${s.currentStep}`,
          'color:#6D28D9;font-weight:700',
          'color:inherit'
        )
        console.table(validity)
        console.log('formData:', s.formData)
        console.log('selectedProduct:', s.selectedProduct)
        console.groupEnd()
      }

      return {
        currentStep: 1,
        formData: initialFormData,
        selectedProduct: null,

        setStep: (step: number) => {
          set({ currentStep: Math.max(1, Math.min(4, step)) })
          log('setStep')
        },

        nextStep: () => {
          const { currentStep } = get()
          if (currentStep < 4) {
            set({ currentStep: currentStep + 1 })
            log('nextStep')
          } else {
            log('nextStep (noop at last step)')
          }
        },

        prevStep: () => {
          const { currentStep } = get()
          if (currentStep > 1) {
            set({ currentStep: currentStep - 1 })
            log('prevStep')
          } else {
            log('prevStep (noop at first step)')
          }
        },

        updateFormData: (data: Partial<personaliseFormData>) => {
          set((state) => ({
            formData: { ...state.formData, ...data }
          }))
          // optional: live log on field updates—comment out if too noisy
          // log('updateFormData')
        },

        setSelectedProduct: (product: Product) => {
          set({ selectedProduct: product })
          console.log("pr", product)
        },

        resetCheckout: () => {
          set({ currentStep: 1, formData: initialFormData, selectedProduct: null })
          log('resetCheckout')
        },

        loadExistingData: (data: personaliseFormData, product: Product) => {
          set({ currentStep: 1, formData: data, selectedProduct: product })
          log('loadExistingData')
        },

        validateStep: (step: number) => {
          const { formData } = get()
          switch (step) {
            case 1:
              return !!(
                formData.yourName?.trim() &&
                formData.recipientName?.trim() &&
                formData.recipientPhone?.trim() &&
                formData.recipientEmail?.trim() &&
                isValidPhone(formData.recipientPhone) &&
                isValidEmail(formData.recipientEmail)
              )
            case 2:
              return !!(
                formData.headerText?.trim() &&
                formData.selectedFont &&
                (formData.customMessage?.trim() || formData.selectedQuote?.trim())
              )
            case 3:
              return !!(
                formData.deliveryDate &&
                formData.preferredDeliveryTime &&
                formData.smsUpdates
              )
            case 4:
              return (
                get().validateStep(1) &&
                get().validateStep(2) &&
                get().validateStep(3)
              )
            default:
              return false
          }
        },

        isStepValid: (step: number) => get().validateStep(step),

        // expose manual logger
        printSnapshot: (label?: string) => log(label ?? 'manual snapshot'),
      }
    },
    {
      name: 'checkout-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        selectedProduct: state.selectedProduct
      })
    }
  )
)
