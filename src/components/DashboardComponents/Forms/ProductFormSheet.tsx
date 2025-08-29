// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { useProductAdminStore } from "@/store/admin/productStore";
// import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore";
// import {
//   Upload,
//   X,
//   Plus,
//   Package,
//   ImageIcon,
//   AlertCircle,
// } from "lucide-react";
// import Image from "next/image";

// const productSchema = z.object({
//   name: z.string().min(1, "Product name is required"),
//   description: z.string().min(1, "Description is required"),
//   inventory: z.number().int().min(0, "Inventory must be at least 0"),
//   price: z.number().min(0, "Price must be at least 0"),
//   title: z.string().optional(),
//   slug: z.string().min(1, "Slug is required"),
//   category: z.string().min(1, "Category is required"),
//   packaging: z.string().optional(),
//   why_we_chose_it: z.string().min(1, "Why we chose it is required"),
//   about_the_maker: z.string().min(1, "About the maker is required"),
//   particulars: z.string().min(1, "Particulars are required"),
//   threshold: z.number().min(0, "Threshold must be at least 0"),
// });

// type ProductFormValues = z.infer<typeof productSchema>;

// interface ProductFormSheetProps {
//   isEdit?: boolean;
//   productId?: string;
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   trigger?: React.ReactNode;
// }

// export function ProductFormSheet({
//   isEdit = false,
//   productId,
//   open: controlledOpen,
//   onOpenChange: controlledOnOpenChange,
//   trigger,
// }: ProductFormSheetProps) {
//   const [internalOpen, setInternalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("form");
//   const [images, setImages] = useState<(File | string)[]>([]);
//   const [customCategory, setCustomCategory] = useState("");
//   const [showCustomCategory, setShowCustomCategory] = useState(false);
//   const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = controlledOnOpenChange || setInternalOpen;
//   const [removedImages, setRemovedImages] = useState<string[]>([]);

//   const {
//     createProduct,
//     updateProduct,
//     categories,
//     fetchCategories,
//     selectedProduct,
//     fetchProductById,
//     fetchProducts,
//     loading,
//   } = useProductAdminStore();

//   const {
//     settings: siteSettings,
//     fetchSettings
//   } = useSiteSettingsStore();

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       inventory: 0,
//       price: 0,
//       title: "",
//       slug: "",
//       category: "",
//       packaging: "",
//       why_we_chose_it: "",
//       about_the_maker: "",
//       particulars: "",
//       threshold: 0
//     },
//   });

//   const watchedValues = form.watch();

//   useEffect(() => {
//     if (open) {
//       fetchCategories();
//       fetchSettings();
//       if (isEdit && productId) {
//         fetchProductById(productId);
//       } else {
//         // Reset form for new product
//         form.reset({
//           name: "",
//           description: "",
//           inventory: 0,
//           price: 0,
//           title: "",
//           slug: "",
//           category: "",
//           packaging: "",
//           why_we_chose_it: "",
//           about_the_maker: "",
//           particulars: "",
//           threshold: 0
//         });
//         setImages([]);
//       }
//     }
//   }, [open, isEdit, productId, fetchCategories, fetchSettings, fetchProductById, form]);

//   useEffect(() => {
//     if (!open) {
//       setRemovedImages([]);
//     }
//   }, [open]);

//   useEffect(() => {
//     if (isEdit && selectedProduct) {
//       form.reset({
//         name: selectedProduct.name || "",
//         description: selectedProduct.description || "",
//         inventory: selectedProduct.inventory || 0,
//         price: selectedProduct.price || 0,
//         title: selectedProduct.title || "",
//         slug: selectedProduct.slug || "",
//         category: selectedProduct.category || "",
//         packaging: selectedProduct.packaging || "",
//         why_we_chose_it: selectedProduct.why_we_chose_it || "",
//         about_the_maker: selectedProduct.about_the_maker || "",
//         particulars: selectedProduct.particulars || "",
//         threshold: selectedProduct.threshold || 0
//       });
//       setImages([
//         selectedProduct.image_1,
//         selectedProduct.image_2,
//         selectedProduct.image_3,
//         selectedProduct.image_4,
//         selectedProduct.image_5,
//       ].filter((img): img is string => Boolean(img)));
//     }
//   }, [isEdit, selectedProduct, form]);

//   const generateSlug = (name: string) => {
//     return name
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/\s+/g, "-");
//   };

//   const handleNameChange = (value: string) => {
//     form.setValue("name", value);
//     if (!isEdit) {
//       const slug = generateSlug(value);
//       form.setValue("slug", slug);
//     }
//   };

//   const handleCategorySelect = (value: string) => {
//     if (value === "custom") {
//       setShowCustomCategory(true);
//       form.setValue("category", "");
//     } else {
//       setShowCustomCategory(false);
//       setCustomCategory("");
//       form.setValue("category", value);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const selectedFiles = Array.from(e.target.files);

//     setImages((prev) => {
//       const combined = [...prev, ...selectedFiles];
//       return combined.slice(0, 5); // max 5 images
//     });

//     // Reset input so same file can be selected again
//     e.target.value = "";
//   };

//   const removeImage = (index: number) => {
//     setImages((prev) => {
//       const removed = prev[index];
//       // Only add to removedImages if it’s an existing image (string)
//       if (typeof removed === "string") {
//         setRemovedImages((prevRemoved) => [...prevRemoved, removed]);
//       }
//       // Remove from images array
//       return prev.filter((_, i) => i !== index);
//     });
//   };

//   const onSubmit = async (data: ProductFormValues) => {
//     try {
//       if (!isEdit && images.length === 0) {
//         toast.error("Please upload at least one image");
//         return;
//       }

//       const formData = new FormData();
//       Object.entries(data).forEach(([key, value]) => {
//         if (value != null && value !== "") {
//           formData.append(key, String(value));
//         }
//       });

//       // Append only new images (File objects)
//       images.forEach((fileOrUrl, i) => {
//         if (fileOrUrl instanceof File) {
//           formData.append(`image_${i + 1}`, fileOrUrl);
//         }
//       });

//       // Append removed image URLs for deletion
//       if (isEdit && removedImages.length > 0) {
//         removedImages.forEach((url) => formData.append("removedImages[]", url));
//       }

//       if (isEdit && productId) {
//         await updateProduct(productId, formData);
//         toast.success("Product updated successfully");
//       } else {
//         await createProduct(formData);
//         toast.success("Product created successfully");
//       }

//       await fetchProducts();
//       form.reset();
//       setImages([]);
//       setRemovedImages([]);
//       setOpen(false);
//       setActiveTab("form");
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to save product");
//     }
//   };

//   const renderPreview = () => {
//     const formData = form.getValues();
//     const previewImages =
//       images.length > 0
//         ? images.map((img) => typeof img === 'string' ? img : URL.createObjectURL(img))
//         : [];

//     return (
//       <div className="space-y-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
//           <div className="space-y-6">
//             <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
//               {previewImages[0] ? (
//                 <Image
//                   src={previewImages[0]}
//                   alt={formData.name || "Product preview"}
//                   width={400}
//                   height={400}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
//                 </div>
//               )}
//             </div>

//             {previewImages.length > 1 && (
//               <div className="grid grid-cols-4 gap-2">
//                 {previewImages.slice(1, 5).map((imageUrl, index) => (
//                   <div key={index} className="aspect-square bg-muted/20 rounded overflow-hidden">
//                     {imageUrl ? (
//                       <Image
//                         src={imageUrl}
//                         alt={`Thumbnail ${index + 2}`}
//                         width={80}
//                         height={80}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-6 font-[Century-Old-Style]">
//             {/* Product Info */}
//             <div>
//               {formData.category && (
//                 <Badge variant="outline" className="mb-2">
//                   {formData.category}
//                 </Badge>
//               )}
//               <h1 className="text-3xl font-bold mb-2">
//                 {formData.name || "Product Name"}
//               </h1>
//               <p className="text-2xl font-semibold">£{formData.price || 0}</p>
//             </div>

//             {/* Description */}
//             {formData.description && (
//               <div>
//                 <h3 className="text-muted-foreground small-text">Description</h3>
//                 <p className="leading-relaxed">
//                   {formData.description}
//                 </p>
//               </div>
//             )}

//             {/* Stock Info */}
//             <div className="flex items-center gap-4">
//               <div>
//                 <Label className="small-text text-muted-foreground">Stock</Label>
//                 <p className="">{formData.inventory || 0} units</p>
//               </div>
//               {formData.threshold && (
//                 <div>
//                   <Label className="small-text text-muted-foreground">Low Stock Alert</Label>
//                   <p className="font-medium">
//                     {formData.threshold} units
//                   </p>
//                 </div>
//               )}
//             </div>

//             {formData.packaging && (
//               <div>
//                 <Label className="small-text text-muted-foreground">Packaging</Label>
//                 {(() => {
//                   const selectedPackaging = siteSettings.packaging?.find(
//                     (pkg) => pkg.image_url === formData.packaging
//                   );
//                   return selectedPackaging ? (
//                     <div className="flex items-center gap-3 mt-1">
//                       <img
//                         src={selectedPackaging.image_url}
//                         alt={selectedPackaging.title}
//                         className="w-8 h-8 object-cover rounded"
//                       />
//                       <span className="text-sm">
//                         {selectedPackaging.title}
//                       </span>
//                     </div>
//                   ) : (
//                     <p className="text-sm">Custom packaging selected</p>
//                   );
//                 })()}
//               </div>
//             )}

//             {(formData.why_we_chose_it ||
//               formData.about_the_maker ||
//               formData.particulars) && (
//                 <div className="space-y-4">
//                   {formData.why_we_chose_it && (
//                     <div>
//                       <h4 className="small-text text-muted-foreground">Why We Chose It</h4>
//                       <p className="text-sm leading-relaxed">
//                         {formData.why_we_chose_it}
//                       </p>
//                     </div>
//                   )}

//                   {formData.about_the_maker && (
//                     <div>
//                       <h4 className="small-text text-muted-foreground">About the Maker</h4>
//                       <p className="text-sm leading-relaxed">
//                         {formData.about_the_maker}
//                       </p>
//                     </div>
//                   )}

//                   {formData.particulars && (
//                     <div>
//                       <h4 className="small-text text-muted-foreground">Particulars</h4>
//                       <div className="text-sm">
//                         {formData.particulars.split("\n").map((line, index) => (
//                           <p key={index}>{line}</p>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       {trigger ? (
//         <SheetTrigger asChild>
//           {trigger}
//         </SheetTrigger>
//       ) : (
//         <SheetTrigger asChild>
//           <Button size="lg">
//             <Plus className="mr-2 h-4 w-4" />
//             {isEdit ? "Edit Product" : "Add Product"}
//           </Button>
//         </SheetTrigger>
//       )}
//       {/* <SheetContent side="bottom" className="h-[80vh] w-[60vw] max-w-full mx-auto overflow-y-auto px-6 py-6 lg:mx-30 mx-4 rounded-t-xl"> */}
//       <SheetContent
//         side="bottom"
//         className="h-[90vh] w-[70vw] max-w-full px-6 py-6 rounded-t-xl overflow-y-auto"
//         style={{
//           left: "50%",
//           transform: "translateX(-50%)"
//         }}
//       >

//         <SheetHeader className="space-y-4 pb-6">
//           <div className="flex items-center gap-2">
//             <Package className="h-6 w-6" />
//             <SheetTitle className="text-2xl">
//               {isEdit ? "Edit Product" : "Add New Product"}
//             </SheetTitle>
//           </div>
//           <SheetDescription>
//             {isEdit
//               ? "Update your product information and preview changes."
//               : "Create a new product with all required information and preview before saving."}
//           </SheetDescription>
//         </SheetHeader>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="">
//             <TabsTrigger value="form" className="flex items-center gap-2">
//               Product Form
//             </TabsTrigger>
//             <TabsTrigger value="preview" className="flex items-center gap-2">
//               Preview
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="form" className="space-y-6 mt-6">
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="flex items-center gap-1">
//                       Product Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="name"
//                       {...form.register("name", {
//                         onChange: (e) => handleNameChange(e.target.value),
//                       })}
//                       placeholder="Enter product name"
//                     />
//                     {form.formState.errors.name && (
//                       <p className="text-sm text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         {form.formState.errors.name.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="slug" className="flex items-center gap-1">
//                       URL Slug <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="slug"
//                       {...form.register("slug")}
//                       placeholder="product-url-slug"
//                     />
//                     {form.formState.errors.slug && (
//                       <p className="text-sm text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         {form.formState.errors.slug.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="description"
//                   className="flex items-center gap-1"
//                 >
//                   Description <span className="text-red-500">*</span>
//                 </Label>
//                 <Textarea
//                   id="description"
//                   {...form.register("description")}
//                   rows={4}
//                   placeholder="Describe your product..."
//                 />
//                 {form.formState.errors.description && (
//                   <p className="text-sm text-red-500 flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {form.formState.errors.description.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="price" className="flex items-center gap-1">
//                     Price (£) <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="price"
//                     type="number"
//                     step="0.01"
//                     {...form.register("price", { valueAsNumber: true })}
//                     placeholder="0.00"
//                   />
//                   {form.formState.errors.price && (
//                     <p className="text-sm text-red-500 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {form.formState.errors.price.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="inventory"
//                     className="flex items-center gap-1"
//                   >
//                     Inventory <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="inventory"
//                     type="number"
//                     {...form.register("inventory", { valueAsNumber: true })}
//                     placeholder="0"
//                   />
//                   {form.formState.errors.inventory && (
//                     <p className="text-sm text-red-500 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {form.formState.errors.inventory.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="threshold">
//                     Low Stock Alert Threshold <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="threshold"
//                     type="number"
//                     {...form.register("threshold", {
//                       valueAsNumber: true,
//                       setValueAs: v => v === "" ? 0 : Number(v)
//                     })}
//                     placeholder="5"
//                   />
//                 </div>
//               </div>

//               {/* // Category & Packaging */}
//               <div className="flex gap-6 items-start">
//                 {/* Category */}
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex items-center gap-1">
//                     Category <span className="text-red-500">*</span>
//                   </Label>

//                   <Select
//                     onValueChange={handleCategorySelect}
//                     value={form.getValues("category")}
//                   >
//                     <SelectTrigger className="w-full h-10 text-[15px]">
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {["Literature", "Drinks & Spirits", "Floral", "Home"].map(
//                         (category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         )
//                       )}
//                     </SelectContent>
//                   </Select>

//                   {form.formState.errors.category && (
//                     <p className="text-sm text-red-500 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {form.formState.errors.category.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Packaging */}
//                 <div className="flex-1 space-y-2">
//                   <Label className="flex items-center gap-1">
//                     Packaging <span className="text-red-500">*</span>
//                   </Label>

//                   <Select
//                     onValueChange={(value) =>
//                       form.setValue("packaging", value === "none" ? "" : value)
//                     }
//                     value={form.getValues("packaging") || ""}
//                   >
//                     <SelectTrigger className="w-full h-10 text-[15px]">
//                       <SelectValue placeholder="Select packaging option" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {!form.getValues("packaging") && (
//                         <SelectItem value="none">No packaging</SelectItem>
//                       )}
//                       {siteSettings.packaging?.map((pkg) => (
//                         <SelectItem key={pkg.id} value={pkg.image_url}>
//                           <div className="flex items-center gap-2">
//                             <img
//                               src={pkg.image_url}
//                               alt={pkg.title}
//                               className="w-6 h-6 object-cover rounded"
//                             />
//                             {pkg.title}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   {form.getValues("packaging") && (
//                     <div className="mt-2">
//                       <Label className="text-sm text-muted-foreground">
//                         Selected packaging:
//                       </Label>
//                       <div className="mt-1 p-2 border rounded-lg bg-muted/10 flex items-center gap-3">
//                         {(() => {
//                           const selectedPackaging = siteSettings.packaging?.find(
//                             (pkg) => pkg.image_url === form.getValues("packaging")
//                           );
//                           return selectedPackaging ? (
//                             <>
//                               <img
//                                 src={selectedPackaging.image_url}
//                                 alt={selectedPackaging.title}
//                                 className="w-16 h-16 object-cover rounded-lg border"
//                               />
//                               <div>
//                                 <p className="font-medium text-sm">{selectedPackaging.title}</p>
//                                 <p className="text-xs text-muted-foreground">
//                                   ID: {selectedPackaging.id}
//                                 </p>
//                               </div>
//                             </>
//                           ) : null;
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Product Images */}
//               <div className="space-y-6">
//                 <h3 className="small-text font-medium">
//                   Product Images {!isEdit && <span className="text-red-500">*</span>}
//                 </h3>

//                 <div className="space-y-4">
//                   <div className="border-2 border-dashed rounded-lg p-8 text-center">
//                     <Input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <Label
//                       htmlFor="image-upload"
//                       className="flex flex-col items-center gap-4 cursor-pointer"
//                     >
//                       <Upload className="h-12 w-12 text-muted-foreground" />
//                       <div className="space-y-2">
//                         <p className="font-medium">Click to upload images</p>
//                         <p className="text-sm text-muted-foreground">
//                           Upload up to 5 product images (PNG, JPG, WEBP)
//                         </p>
//                       </div>
//                     </Label>
//                   </div>

//                   {images.length > 0 && (
//                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                       {images.map((img, i) => (
//                         <div key={i} className="relative group">
//                           <div className="aspect-square overflow-hidden rounded-lg border bg-muted/20">
//                             <Image
//                               src={typeof img === "string" ? img : URL.createObjectURL(img)}
//                               alt={`Preview ${i + 1}`}
//                               width={200}
//                               height={200}
//                               className="object-cover w-full h-full"
//                             />
//                           </div>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant="destructive"
//                             className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                             onClick={() => removeImage(i)}
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {!isEdit && images.length === 0 && (
//                     <p className="text-sm text-red-500 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       At least one image is required
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* // Additional Information */}
//               <div className="space-y-6">
//                 <h3 className="small-text font-medium">
//                   Additional Information
//                 </h3>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="why_we_chose_it"
//                       className="flex items-center gap-1"
//                     >
//                       Why We Chose It <span className="text-red-500">*</span>
//                     </Label>
//                     <Textarea
//                       id="why_we_chose_it"
//                       {...form.register("why_we_chose_it")}
//                       rows={3}
//                       placeholder="Explain why this product was selected..."
//                     />
//                     {form.formState.errors.why_we_chose_it && (
//                       <p className="text-sm text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         {form.formState.errors.why_we_chose_it.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="about_the_maker"
//                       className="flex items-center gap-1"
//                     >
//                       About the Maker <span className="text-red-500">*</span>
//                     </Label>
//                     <Textarea
//                       id="about_the_maker"
//                       {...form.register("about_the_maker")}
//                       rows={3}
//                       placeholder="Tell us about the maker or brand..."
//                     />
//                     {form.formState.errors.about_the_maker && (
//                       <p className="text-sm text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         {form.formState.errors.about_the_maker.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="particulars"
//                       className="flex items-center gap-1"
//                     >
//                       Particulars <span className="text-red-500">*</span>
//                     </Label>
//                     <Textarea
//                       id="particulars"
//                       {...form.register("particulars")}
//                       rows={4}
//                       placeholder="Always use commas to separate points. Example: point1, point2, point3"
//                     />
//                     {/* <p className="text-xs text-muted-foreground">
//                       Use bullet points or line breaks to list product details
//                     </p> */}
//                     {form.formState.errors.particulars && (
//                       <p className="text-sm text-red-500 flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         {form.formState.errors.particulars.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-4 py-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setActiveTab("preview")}
//                   disabled={!watchedValues.name}
//                 >
//                   Preview
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="min-w-[120px]"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       {isEdit ? "Updating..." : "Creating..."}
//                     </>
//                   ) : (
//                     <>{isEdit ? "Update Product" : "Create Product"}</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </TabsContent>

//           <TabsContent value="preview" className="space-y-6 mt-6">
//             <div className="space-y-6">
//               {watchedValues.name ? (
//                 renderPreview()
//               ) : (
//                 <div className="text-center py-12">
//                   <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
//                   <p className="text-muted-foreground">
//                     Fill in the product form to see a preview
//                   </p>
//                 </div>
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </SheetContent>
//     </Sheet>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProductAdminStore } from "@/store/admin/productStore";
import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore";
import {
  Upload,
  X,
  Plus,
  Package,
  ImageIcon,
  AlertCircle,
  Trash2,
  Search,
} from "lucide-react";
import Image from "next/image";

/* ---------- Schema (matches DB) ---------- */
const num = z.coerce.number().nonnegative();
const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  inventory: num,
  threshold: num, // ✅ number at variant level
  qty_blocked: num,
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  item: z.string().min(1, "Short name is required").optional(),
  description: z.string().min(1, "Description is required"),
  price: num, // number
  title: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  packaging: z.string().optional(),
  why_we_chose_it: z.string().min(1, "Why we chose it is required"),
  about_the_maker: z.string().min(1, "About the maker is required"),
  particulars: z.string().min(1, "Particulars are required"),

  // New fields aligned with DB
  contains_alcohol: z.boolean(),
  female_founded: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormSheetProps {
  isEdit?: boolean;
  productId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ProductFormSheet({
  isEdit = false,
  productId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: ProductFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [images, setImages] = useState<(File | string)[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const {
    createProduct,
    updateProduct,
    categories,
    fetchCategories,
    selectedProduct,
    fetchProductById,
    fetchProducts,
    products, // for related picker
    loading,
  } = useProductAdminStore();

  const { settings: siteSettings, fetchSettings } = useSiteSettingsStore();

  // const form = useForm<ProductFormValues>({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     name: "",
  //     description: "",
  //     price: 0,
  //     title: "",
  //     slug: "",
  //     category: "",
  //     packaging: "",
  //     why_we_chose_it: "",
  //     about_the_maker: "",
  //     particulars: "",
  //     variants: [{ name: "default", inventory: 0, threshold: 0, qty_blocked: 0 }],
  //   },
  // });

  type ProductFormValues = z.infer<typeof productSchema>;

  const form = useForm<ProductFormValues>({
    // 👇 assert the resolver's field type to align with ProductFormValues
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      title: "",
      slug: "",
      category: "",
      packaging: "",
      why_we_chose_it: "",
      about_the_maker: "",
      particulars: "",
      variants: [
        { name: "default", inventory: 0, threshold: 0, qty_blocked: 0 },
      ],
      contains_alcohol: false,
      female_founded: false,
    },
  });

  const watched = form.watch();

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (open) {
      fetchCategories?.();
      fetchSettings?.();
      fetchProducts?.(1, 200); // populate related picker
      if (isEdit && productId) {
        fetchProductById(productId);
      } else {
        form.reset({
          name: "",
          description: "",
          price: 0,
          title: "",
          slug: "",
          category: "",
          packaging: "",
          why_we_chose_it: "",
          about_the_maker: "",
          particulars: "",
          variants: [
            { name: "default", inventory: 0, threshold: 0, qty_blocked: 0 },
          ],
          contains_alcohol: false,
          female_founded: false,
        });
        setImages([]);
      }
    }
  }, [
    open,
    isEdit,
    productId,
    fetchCategories,
    fetchSettings,
    fetchProductById,
    fetchProducts,
    form,
  ]);

  useEffect(() => {
    if (!open) setRemovedImages([]);
  }, [open]);

  useEffect(() => {
    if (isEdit && selectedProduct) {
      form.reset({
        name: selectedProduct.name ?? "",
        item: (selectedProduct.item) ?? "",
        description: selectedProduct.description ?? "",
        price: (selectedProduct.price as number) ?? 0,
        title: (selectedProduct as any).title ?? "",
        slug: selectedProduct.slug ?? "",
        category: (selectedProduct.category as string) ?? "",
        packaging: (selectedProduct as any).packaging ?? "",
        why_we_chose_it: (selectedProduct as any).why_we_chose_it ?? "",
        about_the_maker: (selectedProduct as any).about_the_maker ?? "",
        particulars: (selectedProduct as any).particulars ?? "",
        variants: Array.isArray((selectedProduct as any).variants)
          ? (selectedProduct as any).variants.map((v: any) => ({
              name: String(v?.name ?? "default"),
              inventory: Number(v?.inventory ?? 0),
              threshold: Number(v?.threshold ?? 0),
              qty_blocked: Number(v?.qty_blocked ?? 0),
            }))
          : [{ name: "default", inventory: 0, threshold: 0, qty_blocked: 0 }],
        contains_alcohol: (selectedProduct as any).contains_alcohol,
        female_founded: (selectedProduct as any).female_founded ?? false,
      });
      setImages(
        [
          (selectedProduct as any).image_1,
          (selectedProduct as any).image_2,
          (selectedProduct as any).image_3,
          (selectedProduct as any).image_4,
          (selectedProduct as any).image_5,
        ].filter(Boolean) as string[]
      );
    }
  }, [isEdit, selectedProduct, form]);

  /* ---------- Helpers ---------- */
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleNameChange = (value: string) => {
    form.setValue("name", value, { shouldValidate: true });
    if (!isEdit) form.setValue("slug", generateSlug(value));
  };

  const handleCategorySelect = (value: string) => {
    form.setValue("category", value, { shouldValidate: true });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles].slice(0, 5));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (typeof target === "string") setRemovedImages((r) => [...r, target]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const totalStock = useMemo(
    () =>
      (watched.variants ?? []).reduce(
        (sum, v) =>
          sum +
          Math.max(0, Number(v.inventory || 0) - Number(v.qty_blocked || 0)),
        0
      ),
    [watched.variants]
  );

  /* ---------- Variants UI ---------- */
  const addVariant = () => {
    form.setValue(
      "variants",
      [
        ...(form.getValues("variants") ?? []),
        { name: "", inventory: 0, threshold: 0, qty_blocked: 0 },
      ],
      { shouldValidate: true }
    );
  };
  const updateVariant = <K extends keyof z.infer<typeof variantSchema>>(
    idx: number,
    key: K,
    value: string
  ) => {
    const next = [...(form.getValues("variants") ?? [])];
    const v = { ...next[idx] };
    // coerce numbers for numeric fields
    if (key === "name") (v as any)[key] = value;
    else (v as any)[key] = value === "" ? 0 : Number(value);
    next[idx] = v;
    form.setValue("variants", next, { shouldValidate: true });
  };
  const removeVariantAt = (idx: number) => {
    const cur = form.getValues("variants") ?? [];
    const next = cur.filter((_, i) => i !== idx);
    form.setValue(
      "variants",
      next.length
        ? next
        : [{ name: "default", inventory: 0, threshold: 0, qty_blocked: 0 }],
      { shouldValidate: true }
    );
  };

  /* ---------- Related products ---------- */
  const [relatedQuery, setRelatedQuery] = useState("");
  const relatedOptions = useMemo(() => {
    const q = relatedQuery.trim().toLowerCase();
    const base = (products ?? []).filter(
      (p: any) => p.id !== (selectedProduct as any)?.id
    );
    if (!q) return base.slice(0, 24);
    return base.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        String(p.category ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [products, relatedQuery, selectedProduct]);

  /* ---------- Submit ---------- */
  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      if (!isEdit && images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const formData = new FormData();
      // primitive fields
      formData.append("name", data.name);
      if (data.item) formData.append("item", data.item);
      formData.append("description", data.description);
      formData.append("price", String(data.price ?? 0));
      if (data.title) formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("category", data.category);
      if (data.packaging) formData.append("packaging", data.packaging);
      formData.append("why_we_chose_it", data.why_we_chose_it);
      formData.append("about_the_maker", data.about_the_maker);
      formData.append("particulars", data.particulars);
      formData.append(
        "contains_alcohol",
        data.contains_alcohol ? "true" : "false"
      );
      formData.append(
        "female_founded",
        data.female_founded ? "true" : "false"
      );

      // json fields
      formData.append("variants", JSON.stringify(data.variants));

      // images (only new files)
      images.forEach((fileOrUrl, i) => {
        if (fileOrUrl instanceof File)
          formData.append(`image_${i + 1}`, fileOrUrl);
      });

      // removed image URLs
      if (isEdit && removedImages.length) {
        removedImages.forEach((url) => formData.append("removedImages[]", url));
      }

      if (isEdit && productId) {
        await updateProduct(productId, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }

      await fetchProducts?.(1, 10);
      form.reset();
      setImages([]);
      setRemovedImages([]);
      setOpen(false);
      setActiveTab("form");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save product");
    }
  };

  /* ---------- Preview ---------- */
  const renderPreview = () => {
    const fd = form.getValues();
    const previewImages =
      images.length > 0
        ? images.map((img) =>
            typeof img === "string" ? img : URL.createObjectURL(img)
          )
        : [];

    const totalThr = (fd.variants ?? []).reduce(
      (s, v) => s + Number(v.threshold || 0),
      0
    );

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <div className="space-y-6">
            <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
              {previewImages[0] ? (
                <Image
                  src={previewImages[0]}
                  alt={fd.name || "Product preview"}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>
            {previewImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {previewImages.slice(1, 5).map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted/20 rounded overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${i + 2}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 font-[Century-Old-Style]">
            <div>
              <div className="flex gap-2 mb-2">
                {fd.category && (
                  <Badge variant="outline">
                    {fd.category}
                  </Badge>
                )}
                {fd.female_founded && (
                  <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                    Female Founded
                  </Badge>
                )}
                {fd.contains_alcohol && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Contains Alcohol
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {fd.name || "Product Name"}
              </h1>
              <p className="text-2xl font-semibold">£{fd.price || 0}</p>
            </div>

            {fd.description && (
              <div>
                <h3 className="text-muted-foreground small-text">
                  Description
                </h3>
                <p className="leading-relaxed">{fd.description}</p>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div>
                <Label className="small-text text-muted-foreground">
                  Total Stock
                </Label>
                <p>{totalStock} units</p>
              </div>
              {totalThr > 0 && (
                <div>
                  <Label className="small-text text-muted-foreground">
                    Combined Threshold
                  </Label>
                  <p className="font-medium">{totalThr} units</p>
                </div>
              )}
            </div>

            {fd.packaging && (
              <div>
                <Label className="small-text text-muted-foreground">
                  Packaging
                </Label>
                {(() => {
                  const selected = siteSettings.packaging?.find(
                    (p) => p.image_url === fd.packaging
                  );
                  return selected ? (
                    <div className="flex items-center gap-3 mt-1">
                      <img
                        src={selected.image_url}
                        alt={selected.title}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-sm">{selected.title}</span>
                    </div>
                  ) : (
                    <p className="text-sm">Custom packaging selected</p>
                  );
                })()}
              </div>
            )}

            {(fd.why_we_chose_it || fd.about_the_maker || fd.particulars) && (
              <div className="space-y-4">
                {fd.why_we_chose_it && (
                  <div>
                    <h4 className="small-text text-muted-foreground">
                      Why We Chose It
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {fd.why_we_chose_it}
                    </p>
                  </div>
                )}
                {fd.about_the_maker && (
                  <div>
                    <h4 className="small-text text-muted-foreground">
                      About the Maker
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {fd.about_the_maker}
                    </p>
                  </div>
                )}
                {fd.particulars && (
                  <div>
                    <h4 className="small-text text-muted-foreground">
                      Particulars
                    </h4>
                    <div className="text-sm">
                      {fd.particulars.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ---------- Render ---------- */
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            {isEdit ? "Edit Product" : "Add Product"}
          </Button>
        </SheetTrigger>
      )}

      <SheetContent
        side="bottom"
        className="h-[90vh] w-[70vw] max-w-full px-6 py-6 rounded-t-xl overflow-y-auto"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <SheetHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <SheetTitle className="text-2xl">
              {isEdit ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </div>
          <SheetDescription>
            {isEdit
              ? "Update your product information and preview changes."
              : "Create a new product with all required information and preview before saving."}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="form">Product Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 mt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...form.register("name", {
                      onChange: (e) => handleNameChange(e.target.value),
                    })}
                    placeholder="Enter product name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item">
                    Item <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="item"
                    {...form.register("item")}
                    placeholder="Enter item"
                  />
                  {form.formState.errors.item && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.item.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    URL Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    {...form.register("slug")}
                    placeholder="product-url-slug"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe your product..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (£) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("price")}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Category <span className="text-red-500">*</span>
                  </Label>
                  {/* <Select onValueChange={handleCategorySelect} value={form.getValues("category")}>
                    <SelectTrigger className="w-full h-10 text-[15px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories?.length ? categories : ["Literature", "Drinks & Spirits", "Floral", "Home"]).map((c: any) => (
                        <SelectItem key={typeof c === "string" ? c : c.name} value={typeof c === "string" ? c : c.name}>
                          {typeof c === "string" ? c : c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <Select
                    onValueChange={handleCategorySelect}
                    value={form.watch("category") || ""}
                  >
                    <SelectTrigger className="w-full h-10 text-[15px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Literature", "Drinks & Spirits", "Floral", "Home"].map(
                        (c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  {/* {form.formState.errors.category && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{form.formState.errors.category.message}</p>} */}
                </div>

                <div className="space-y-2">
                  <Label>Packaging</Label>
                  <Select
                    onValueChange={(v) =>
                      form.setValue("packaging", v === "none" ? "" : v)
                    }
                    value={form.getValues("packaging") || ""}
                  >
                    <SelectTrigger className="w-full h-10 text-[15px]">
                      <SelectValue placeholder="Select packaging option" />
                    </SelectTrigger>
                    <SelectContent>
                      {!form.getValues("packaging") && (
                        <SelectItem value="none">No packaging</SelectItem>
                      )}
                      {siteSettings.packaging?.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.image_url}>
                          <div className="flex items-center gap-2">
                            <img
                              src={pkg.image_url}
                              alt={pkg.title}
                              className="w-6 h-6 object-cover rounded"
                            />
                            {pkg.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="small-text font-medium">
                    Variants <span className="text-red-500">*</span>
                  </h3>
                  <Button type="button" size="sm" onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Variant
                  </Button>
                </div>

                {(watched.variants ?? []).map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border rounded-md p-3 bg-white"
                  >
                    <div className="space-y-1.5">
                      <Label>Name</Label>
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          updateVariant(idx, "name", e.target.value)
                        }
                        placeholder="default / small / large"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Inventory</Label>
                      <Input
                        type="number"
                        value={String(v.inventory ?? 0)}
                        onChange={(e) =>
                          updateVariant(idx, "inventory", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Threshold</Label>
                      <Input
                        type="number"
                        value={String(v.threshold ?? 0)}
                        onChange={(e) =>
                          updateVariant(idx, "threshold", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Qty Blocked</Label>
                      <Input
                        type="number"
                        value={String(v.qty_blocked ?? 0)}
                        onChange={(e) =>
                          updateVariant(idx, "qty_blocked", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex md:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariantAt(idx)}
                        aria-label="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {form.formState.errors.variants && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.variants.message as string}
                  </p>
                )}

                <div className="flex items-center gap-6 pt-1">
                  <div>
                    <Label className="small-text text-muted-foreground">
                      Total Stock
                    </Label>
                    <p>{totalStock} units</p>
                  </div>
                  <div>
                    <Label className="small-text text-muted-foreground">
                      Combined Threshold
                    </Label>
                    <p className="font-medium">
                      {(watched.variants ?? []).reduce(
                        (s, v) => s + Number(v.threshold || 0),
                        0
                      )}{" "}
                      units
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-6">
                <h3 className="small-text font-medium">
                  Product Images{" "}
                  {!isEdit && <span className="text-red-500">*</span>}
                </h3>
                <div className="space-y-4">
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
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="font-medium">Click to upload images</p>
                        <p className="text-sm text-muted-foreground">
                          Upload up to 5 product images (PNG, JPG, WEBP)
                        </p>
                      </div>
                    </Label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border bg-muted/20">
                            <Image
                              src={
                                typeof img === "string"
                                  ? img
                                  : URL.createObjectURL(img)
                              }
                              alt={`Preview ${i + 1}`}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(i)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isEdit && images.length === 0 && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> At least one image is
                      required
                    </p>
                  )}
                </div>
              </div>

              {/* Additional */}
              <div className="space-y-6">
                <h3 className="small-text font-medium">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="why_we_chose_it">
                      Why We Chose It <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="why_we_chose_it"
                      rows={3}
                      placeholder="Explain why this product was selected..."
                      {...form.register("why_we_chose_it")}
                    />
                    {form.formState.errors.why_we_chose_it && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {form.formState.errors.why_we_chose_it.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about_the_maker">
                      About the Maker <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="about_the_maker"
                      rows={3}
                      placeholder="Tell us about the maker or brand..."
                      {...form.register("about_the_maker")}
                    />
                    {form.formState.errors.about_the_maker && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {form.formState.errors.about_the_maker.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="particulars">
                      Particulars <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="particulars"
                      rows={4}
                      placeholder="Bullet points or lines"
                      {...form.register("particulars")}
                    />
                    {form.formState.errors.particulars && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {form.formState.errors.particulars.message}
                      </p>
                    )}
                  </div>

                  {/* ✅ New Fields: Contains Alcohol & Female Founded */}
                  <div className="flex items-center gap-8 pt-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="contains_alcohol"
                        {...form.register("contains_alcohol")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="contains_alcohol">Contains Alcohol</Label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="female_founded"
                        {...form.register("female_founded")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="female_founded">Female Founded</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 py-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  disabled={!watched.name}
                >
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEdit ? "Update Product" : "Create Product"}</>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <div className="space-y-6">
              {watched.name ? (
                renderPreview()
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Fill in the product form to see a preview
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
