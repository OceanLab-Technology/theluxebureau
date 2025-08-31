import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableContextType,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import Image from "next/image";

interface DraggableImageGridProps {
  images: (File | string)[];
  onImagesChange: (images: (File | string)[]) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

interface SortableImageItemProps {
  id: string;
  image: File | string;
  index: number;
  onRemove: (index: number) => void;
}

function SortableImageItem({ id, image, index, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "z-50 opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="aspect-square overflow-hidden rounded-lg border bg-muted/20 relative cursor-grab active:cursor-grabbing">
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
        
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
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
          onPointerDown={(e) => e.stopPropagation()}
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
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((_, index) => `image-${index}` === active.id);
      const newIndex = images.findIndex((_, index) => `image-${index}` === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex);
        onImagesChange(newImages);
      }
    }
  };

  const activeImage = activeId ? images[parseInt(activeId.replace('image-', ''))] : null;

  if (images.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((_, index) => `image-${index}`)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <SortableImageItem
              key={`image-${index}`}
              id={`image-${index}`}
              image={image}
              index={index}
              onRemove={onRemoveImage}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeImage ? (
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted/20 relative">
            <Image
              src={typeof activeImage === "string" ? activeImage : URL.createObjectURL(activeImage)}
              alt="Dragging preview"
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
