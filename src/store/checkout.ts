import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CheckoutFormData {
  recipientName: string
  recipientAddress: string
  recipientCity: string
  recipientEmail: string
  deliveryDate: string
  preferredDeliveryTime: string
  headerStyle: string
  selectedQuote: string
  customMessage: string
  smsUpdates: 'send-to-me' | 'send-to-recipient' | 'none'
}

interface CheckoutState {
  currentStep: number
  formData: CheckoutFormData
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<CheckoutFormData>) => void
  resetCheckout: () => void
}

const initialFormData: CheckoutFormData = {
  recipientName: '',
  recipientAddress: '',
  recipientCity: '',
  recipientEmail: '',
  deliveryDate: '',
  preferredDeliveryTime: '',
  headerStyle: '',
  selectedQuote: '',
  customMessage: '',
  smsUpdates: 'none'
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: initialFormData,
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
      updateFormData: (data: Partial<CheckoutFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      resetCheckout: () =>
        set({ currentStep: 1, formData: initialFormData })
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({ 
        currentStep: state.currentStep, 
        formData: state.formData 
      })
    }
  )
)
