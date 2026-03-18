import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCcw } from 'lucide-react';

interface CropModalProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
  aspect?: number;
}

const CropModal: React.FC<CropModalProps> = ({ image, onCropComplete, onClose, aspect = 16 / 9 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/png');
    });
  };

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(croppedImage);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Refine Visual</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Image Cropping Tool</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="relative h-[400px] bg-gray-900 border-x border-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            classes={{
              containerClassName: "bg-gray-900",
            }}
          />
        </div>

        <div className="p-8 space-y-8 bg-white/80 backdrop-blur-md">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zoom Control</label>
              <span className="text-[10px] font-black text-blue-600">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            <button
              onClick={handleDone}
              className="flex-[2] flex items-center justify-center space-x-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
            >
              <Check size={18} />
              <span>Save Crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
