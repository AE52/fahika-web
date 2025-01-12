import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

interface Fotograf {
  url: string;
  sira: number;
}

interface SortableFotoProps {
  foto: Fotograf;
  index: number;
  onSil: () => void;
}

export default function SortableFoto({ foto, index, onSil }: SortableFotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: foto.url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-32 h-32 bg-gray-100 rounded-lg overflow-hidden"
      {...attributes}
      {...listeners}
    >
      <div className="relative w-full h-full">
        <Image
          src={foto.url}
          alt={`Fotoğraf ${index + 1}`}
          fill
          className="object-cover"
          sizes="128px"
          onError={(e: any) => {
            console.error('Fotoğraf yükleme hatası:', e);
            e.currentTarget.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSil();
        }}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Fotoğrafı sil"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
} 