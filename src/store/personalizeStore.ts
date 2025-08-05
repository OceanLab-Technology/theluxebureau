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
  validateStep: (step: number) => boolean
  isStepValid: (step: number) => boolean
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
        set({ currentStep: 1, formData: initialFormData, selectedProduct: null }),
      validateStep: (step: number) => {
        const { formData } = get()
        
        switch (step) {
          case 1: // Recipient Details Step
            return !!(
              formData.yourName?.trim() &&
              formData.recipientName?.trim() &&
              formData.recipientAddress?.trim() &&
              formData.recipientCity?.trim() &&
              formData.recipientEmail?.trim()
            )
          
          case 2: // Personalization Step
            return !!(
              formData.headerText?.trim() &&
              formData.selectedFont &&
              (formData.customMessage?.trim() || formData.selectedQuote?.trim())
            )
          
          case 3: // Delivery Details Step
            return !!(
              formData.deliveryDate &&
              formData.preferredDeliveryTime &&
              formData.smsUpdates
            )
          
          case 4: // Summary Step - all previous steps should be valid
            return (
              get().validateStep(1) &&
              get().validateStep(2) &&
              get().validateStep(3)
            )
          
          default:
            return false
        }
      },
      isStepValid: (step: number) => {
        return get().validateStep(step)
      }
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
