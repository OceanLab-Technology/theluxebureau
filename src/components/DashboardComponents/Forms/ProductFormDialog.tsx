// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useProductAdminStore } from "@/store/admin/productStore";
// import { toast } from "sonner";
// import { de } from "zod/v4/locales";

// const productSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   price: z.coerce.number().min(0, "Price must be at least 0"),
//   inventory: z.coerce.number().int().min(0, "Inventory must be at least 0"),
//   category: z.string().min(1, "Category is required"),
//   description: z.string().optional(),
//   title: z.string().optional(),
//   why_we_chose_it: z.string().optional(),
//   about_the_maker: z.string().optional(),
//   particulars: z.string().optional(),
//   slug: z.string().nonempty(),
// });

// type ProductFormValues = z.input<typeof productSchema>;

// export function ProductFormDialog() {
//   const [open, setOpen] = useState(false);
//   const [images, setImages] = useState<File[]>([]);
//   const { createProduct, loading } = useProductAdminStore();

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: "",
//       price: 0,
//       inventory: 0,
//       category: "",
//     },
//   });

//   const onSubmit = async (data: ProductFormValues) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("price", String(data.price));
//       formData.append("inventory", String(data.inventory));
//       formData.append("category", data.category);
//       formData.append("description", data.description || "");
//       formData.append("title", data.title || "");
//       formData.append("why_we_chose_it", data.why_we_chose_it || "");
//       formData.append("about_the_maker", data.about_the_maker || "");
//       formData.append("particulars", data.particulars || "");
//       formData.append("slug", data.slug);

//       images.slice(0, 5).forEach((file, index) => {
//         formData.append(`image_${index + 1}`, file);
//       });

//       await createProduct(formData);

//       toast.success("Product created", {
//         description: `${data.name} was added to your catalog.`,
//       });

//       form.reset();
//       setImages([]);
//       setOpen(false);
//     } catch (error: any) {
//       toast.error("Error", {
//         description: error?.message || "Failed to create product.",
//       });
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const selected = Array.from(files).slice(0, 5);
//       setImages(selected);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <span className="mr-2">+</span> Add Product
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Product</DialogTitle>
//         </DialogHeader>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-4 pt-4"
//           encType="multipart/form-data"
//         >
//           <Input {...form.register("name")} placeholder="Product name" />
//           <Input {...form.register("price")} placeholder="Price" type="number" />
//           <Input {...form.register("inventory")} placeholder="Inventory" type="number" />
//           <Input {...form.register("category")} placeholder="Category" />
//           <Input {...form.register("description")} placeholder="Description" />
//           <Input {...form.register("title")} placeholder="Title" />
//           <Input {...form.register("why_we_chose_it")} placeholder="Why We Chose It" />
//           <Input {...form.register("about_the_maker")} placeholder="About The Maker" />
//           <Input {...form.register("particulars")} placeholder="Particulars" />
//           <Input {...form.register("slug")} placeholder="Slug" />
//           <Input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//           <Button type="submit" disabled={loading} className="w-full">
//             {loading ? "Creating..." : "Create Product"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }



// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useProductAdminStore } from "@/store/admin/productStore";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// const productSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   price: z.coerce.number().min(0, "Price must be at least 0"),
//   inventory: z.coerce.number().int().min(0, "Inventory must be at least 0"),
//   category: z.string().min(1, "Category is required"),
//   description: z.string().optional(),
//   title: z.string().optional(),
//   why_we_chose_it: z.string().optional(),
//   about_the_maker: z.string().optional(),
//   particulars: z.string().optional(),
//   slug: z.string().nonempty("Slug is required"),
// });

// type ProductFormValues = z.input<typeof productSchema>;

// export function ProductFormDialog() {
//   const [open, setOpen] = useState(false);
//   const [images, setImages] = useState<File[]>([]);
//   const { createProduct, loading } = useProductAdminStore();

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: "",
//       price: 0,
//       inventory: 0,
//       category: "",
//     },
//   });

//   const onSubmit = async (data: ProductFormValues) => {
//     try {
//       const formData = new FormData();
//       for (const key in data) {
//         formData.append(key, (data as any)[key] ?? "");
//       }

//       images.slice(0, 5).forEach((file, index) => {
//         formData.append(`image_${index + 1}`, file);
//       });

//       await createProduct(formData);
//       toast.success("Product created", {
//         description: `${data.name} was added to your catalog.`,
//       });

//       form.reset();
//       setImages([]);
//       setOpen(false);
//     } catch (error: any) {
//       toast.error("Error", {
//         description: error?.message || "Failed to create product.",
//       });
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const selected = Array.from(files).slice(0, 5);
//       setImages(selected);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <span className="mr-2">+</span> Add Product
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Create New Product</DialogTitle>
//         </DialogHeader>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="grid gap-6 py-4"
//           encType="multipart/form-data"
//         >
//           {/* Basic Info */}
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input {...form.register("name")} placeholder="Product name" />
//               {form.formState.errors.name && (
//                 <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="slug">Slug</Label>
//               <Input {...form.register("slug")} placeholder="slug-example" />
//               {form.formState.errors.slug && (
//                 <p className="text-sm text-red-500 mt-1">{form.formState.errors.slug.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <div>
//               <Label htmlFor="price">Price</Label>
//               <Input type="number" {...form.register("price")} />
//             </div>
//             <div>
//               <Label htmlFor="inventory">Inventory</Label>
//               <Input type="number" {...form.register("inventory")} />
//             </div>
//             <div>
//               <Label htmlFor="category">Category</Label>
//               <Input {...form.register("category")} placeholder="e.g. Accessories" />
//             </div>
//           </div>

//           {/* Optional Fields */}
//           <div className="grid gap-4">
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea {...form.register("description")} rows={3} />
//             </div>
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input {...form.register("title")} />
//             </div>
//             <div>
//               <Label htmlFor="why_we_chose_it">Why We Chose It</Label>
//               <Textarea {...form.register("why_we_chose_it")} rows={2} />
//             </div>
//             <div>
//               <Label htmlFor="about_the_maker">About The Maker</Label>
//               <Textarea {...form.register("about_the_maker")} rows={2} />
//             </div>
//             <div>
//               <Label htmlFor="particulars">Particulars</Label>
//               <Textarea {...form.register("particulars")} rows={2} />
//             </div>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <Label>Images (max 5)</Label>
//             <Input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//             {images.length > 0 && (
//               <div className="grid grid-cols-5 gap-2 mt-2">
//                 {images.map((img, i) => (
//                   <div
//                     key={i}
//                     className="aspect-square overflow-hidden rounded border bg-muted text-muted-foreground text-sm flex items-center justify-center"
//                   >
//                     <img
//                       src={URL.createObjectURL(img)}
//                       alt={`preview-${i}`}
//                       className="object-cover w-full h-full"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <Button type="submit" disabled={loading} className="w-full text-base">
//             {loading ? "Creating..." : "Create Product"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductAdminStore } from "@/store/admin/productStore";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const productSchema = z.object({
    name: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "URL slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be at least 0"),
    inventory: z.coerce.number().int().min(0, "Inventory must be at least 0"),
    category: z.string().min(1, "Category is required"),
    title: z.string().optional(),
    why_we_chose_it: z.string().optional(),
    about_the_maker: z.string().optional(),
    particulars: z.string().optional(),
});

type ProductFormValues = z.input<typeof productSchema>;

const STEPS = ["Basic Info", "Images", "Content", "Review"];

export function ProductFormDialog() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [images, setImages] = useState<File[]>([]);
    const { createProduct, loading } = useProductAdminStore();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            price: 0,
            inventory: 0,
            category: "",
            title: "",
            why_we_chose_it: "",
            about_the_maker: "",
            particulars: "",
        },
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files).slice(0, 5);
        setImages(files);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ProductFormValues) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value != null) {
                    formData.append(key, String(value));
                }
            });

            images.forEach((file, i) => {
                formData.append(`image_${i + 1}`, file);
            });

            await createProduct(formData);
            toast.success("Product created", { description: `${data.name} was added.` });
            form.reset();
            setImages([]);
            setOpen(false);
            setStep(0);
        } catch (err: any) {
            toast.error("Failed to create product", { description: err?.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg">
                    <span className="mr-2">+</span> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
                    
                    {/* Progress Bar */}
                    <div className="w-full flex items-center gap-2">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex-1">
                                <div className={`h-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
                            </div>
                        ))}
                    </div>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
                    {step === 0 && (
                        <div className="space-y-6">
                            <div>
                                <Label className="text-base">Product Title *</Label>
                                <Input {...form.register("name")} className="mt-2" placeholder="Enter product title" />
                                <ErrorText message={form.formState.errors.name?.message} />
                            </div>
                            <div>
                                <Label className="text-base">URL Slug *</Label>
                                <Input {...form.register("slug")} className="mt-2" placeholder="product-url-slug" />
                                <ErrorText message={form.formState.errors.slug?.message} />
                            </div>
                            <div>
                                <Label className="text-base">Description *</Label>
                                <Textarea {...form.register("description")} className="mt-2" rows={3} />
                                <ErrorText message={form.formState.errors.description?.message} />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-base">Price (€) *</Label>
                                    <Input type="number" {...form.register("price")} className="mt-2" />
                                    <ErrorText message={form.formState.errors.price?.message} />
                                </div>
                                <div>
                                    <Label className="text-base">Inventory</Label>
                                    <Input type="number" {...form.register("inventory")} className="mt-2" />
                                </div>
                                <div>
                                    <Label className="text-base">Category *</Label>
                                    <Input {...form.register("category")} className="mt-2" placeholder="Select a category" />
                                    <ErrorText message={form.formState.errors.category?.message} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <Label 
                                    htmlFor="image-upload" 
                                    className="flex flex-col items-center gap-2 cursor-pointer"
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="font-medium">Click to upload images</span>
                                    <span className="text-sm text-muted-foreground">Upload up to 5 product images</span>
                                </Label>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-5 gap-4">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <div className="aspect-square overflow-hidden rounded-lg border">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`preview-${i}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <Label className="text-base">Title</Label>
                                <Input {...form.register("title")} className="mt-2" placeholder="Optional title" />
                            </div>
                            <div>
                                <Label className="text-base">Why We Chose It *</Label>
                                <Textarea {...form.register("why_we_chose_it")} className="mt-2" rows={3} />
                            </div>
                            <div>
                                <Label className="text-base">About the Maker *</Label>
                                <Textarea {...form.register("about_the_maker")} className="mt-2" rows={3} />
                            </div>
                            <div>
                                <Label className="text-base">Particulars *</Label>
                                <Textarea
                                    {...form.register("particulars")}
                                    className="mt-2"
                                    placeholder="• Size&#13;• ISBN&#13;• What's included..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 p-6 bg-muted rounded-lg">
                            <h3 className="font-medium">Review Your Product</h3>
                            <p className="text-sm text-muted-foreground">
                                Please review all the information you've entered. Click "Create Product" when you're ready to submit.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Images:</span>
                                <span className="text-muted-foreground">{images.length} uploaded</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center gap-4 pt-4">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={prevStep} 
                            disabled={step === 0}
                        >
                            Back
                        </Button>
                        {step < STEPS.length - 1 ? (
                            <Button onClick={nextStep} type="button">
                                Continue
                            </Button>
                        ) : (
                            <Button type="submit" disabled={loading || images.length === 0}>
                                {loading ? "Creating..." : "Create Product"}
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ErrorText({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-red-500 mt-1">{message}</p>;
}
