import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/app/api/types'

export interface personalizeFormData {
  yourName: string
  recipientName: string
  recipientAddress: string
  recipientCity: string
  recipientEmail: string
  deliveryDate: string
  preferredDeliveryTime: string
  selectedFont: string
  headerText: string
  selectedQuote: string
  customMessage: string
  smsUpdates: 'send-to-me' | 'send-to-recipient' | 'none'
}

interface PersonalizeState {
  currentStep: number
  formData: personalizeFormData
  selectedProduct: Product | null
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<personalizeFormData>) => void
  setSelectedProduct: (product: Product) => void
  resetCheckout: () => void
}

const initialFormData: personalizeFormData = {
  yourName: '',
  recipientName: '',
  recipientAddress: '',
  recipientCity: '',
  recipientEmail: '',
  deliveryDate: '',
  preferredDeliveryTime: '',
  headerText: 'Header',
  selectedQuote: '',
  customMessage: '',
  selectedFont: 'default',
  smsUpdates: 'none'
}

export const usePersonalizeStore = create<PersonalizeState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: initialFormData,
      selectedProduct: null,
      setStep: (step: number) => 
        set({ currentStep: Math.max(1, Math.min(4, step)) }),
      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 4) {
          set({ currentStep: currentStep + 1 })
        }
      },
      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },
      updateFormData: (data: Partial<personalizeFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      setSelectedProduct: (product: Product) =>
        set({ selectedProduct: product }),
      resetCheckout: () =>
        set({ currentStep: 1, formData: initialFormData, selectedProduct: null })
    }),
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
