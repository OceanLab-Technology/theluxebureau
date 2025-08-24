"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCustomerAdminStore } from "@/store/admin/customerStore"
import { toast } from "sonner" // ✅ new

const customerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  status: z.enum(["Active", "Inactive", "VIP"]),
})

type FormData = z.infer<typeof customerSchema>

export function CustomerFormDialog() {
  const [open, setOpen] = useState(false)
  const { createCustomer, loading } = useCustomerAdminStore()

  const form = useForm<FormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await createCustomer(data)
      toast.success("Clients created", {
        description: `${data.name} was added successfully.`,
      })
      form.reset()
      setOpen(false)
    } catch (error: any) {
      toast.error("Error", {
        description: "Failed to create customer.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="mr-2">+</span> Add Clients
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Clients</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <Input {...form.register("name")} placeholder="Full name" />
          <Input {...form.register("email")} placeholder="Email" type="email" />
          <Input {...form.register("phone")} placeholder="Phone number" />
          <Input {...form.register("address")} placeholder="Address" />
          <select {...form.register("status")} className="w-full rounded-md border p-2">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="VIP">VIP</option>
          </select>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
