
// Import React correctly
import * as React from "react"

// Import toast types directly from the toast component
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Properly export the hooks and toast function from the actual implementation
import { useToast as useToastHook, toast as toastFunc } from "@/hooks/use-toast"

export { useToastHook as useToast, toastFunc as toast }
