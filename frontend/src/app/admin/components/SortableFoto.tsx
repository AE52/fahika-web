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
  kokuIsim: string;
  onSil: () => void;
}

export function SortableFoto({ foto, index, kokuIsim, onSil }: SortableFotoProps) {
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
      {...attributes}
      {...listeners}
      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
    >
      <div className="w-full h-full relative">
        <Image
          src={foto.url || '/images/placeholder.jpg'}
          alt={`${kokuIsim} - Fotoğraf ${index + 1}`}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e: any) => {
            console.error('Fotoğraf yükleme hatası:', e);
            e.currentTarget.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <button
        onClick={onSil}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 