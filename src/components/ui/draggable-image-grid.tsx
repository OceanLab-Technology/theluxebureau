import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import Image from "next/image";

interface DraggableImageGridProps {
  images: (File | string)[];
  onImagesChange: (images: (File | string)[]) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

interface ImageItemProps {
  image: File | string;
  index: number;
  onRemove: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}

function ImageItem({ 
  image, 
  index, 
  onRemove, 
  onDragStart, 
  onDragOver, 
  onDragEnd,
  isDragging,
  dragOverIndex 
}: ImageItemProps) {
  const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);
  const isBeingDragged = isDragging;
  const isDraggedOver = dragOverIndex === index;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className={`relative group cursor-move transition-all ${
        isBeingDragged ? 'opacity-50 scale-95' : ''
      } ${isDraggedOver ? 'scale-105 ring-2 ring-secondary-foreground' : ''}`}
    >
      <div className="aspect-square overflow-hidden rounded-lg border bg-muted/20 relative">
        <Image
          src={imageUrl}
          alt={`Preview ${index + 1}`}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
        
        <div className="absolute top-2 left-2 p-1 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-gray-600" />
        </div>
        
        <div className="absolute top-2 right-2 bg-secondary-foreground text-white text-xs px-2 py-1 rounded">
          {index + 1}
        </div>
        
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          image_{index + 1}
        </div>
        
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function DraggableImageGrid({
  images,
  onImagesChange,
  onRemoveImage,
  maxImages = 5,
}: DraggableImageGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      
      // Remove the dragged item
      newImages.splice(draggedIndex, 1);
      
      // Insert it at the new position
      newImages.splice(dragOverIndex, 0, draggedImage);
      
      onImagesChange(newImages);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
      {images.map((image, index) => (
        <ImageItem
          key={`image-${index}`}
          image={image}
          index={index}
          onRemove={onRemoveImage}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          isDragging={draggedIndex === index}
          dragOverIndex={dragOverIndex}
        />
      ))}
    </div>
  );
}
