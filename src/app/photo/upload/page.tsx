'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, X, Plus, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/components/providers/AuthProvider';
import type { PhotoUploadData } from '@/types/photo';
import { UPLOAD_CONSTANTS } from '@/lib/constants';

export default function PhotoUploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<PhotoUploadData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      return '파일 크기가 너무 큽니다.';
    }
    
    if (!UPLOAD_CONSTANTS.ALLOWED_FORMATS.includes(file.type as any)) {
      return '지원하지 않는 파일 형식입니다.';
    }

    return null;
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        setErrors(prev => ({
          ...prev,
          file: error
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: PhotoUploadData = {
          file,
          preview: e.target?.result as string,
          title: '',
          description: '',
          tags: []
        };
        setImages(prev => [...prev, newImage]);
        setErrors(prev => {
          const { file, ...rest } = prev;
          return rest;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const updateImage = (index: number, updates: Partial<PhotoUploadData>) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, ...updates } : img
    ));
    
    // Clear errors when user updates fields
    setErrors(prev => {
      const { [`title_${index}`]: titleError, [`description_${index}`]: descError, ...rest } = prev;
      return rest;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const addTag = (imageIndex: number) => {
    if (newTag.trim() && !images[imageIndex].tags.includes(newTag.trim())) {
      if (images[imageIndex].tags.length < UPLOAD_CONSTANTS.MAX_TAGS) {
        updateImage(imageIndex, {
          tags: [...images[imageIndex].tags, newTag.trim()]
        });
        setNewTag('');
      }
    }
  };

  const removeTag = (imageIndex: number, tagToRemove: string) => {
    updateImage(imageIndex, {
      tags: images[imageIndex].tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = (): boolean => {
    // 제목과 설명은 모두 선택사항이므로 항상 유효
    return images.length > 0;
  };

  const handleUpload = async () => {
    if (images.length === 0 || !validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            router.push('/feed');
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-white">
      {images.length === 0 ? (
        /* Upload Area */
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-black mb-4">
              사진 이야기를 들려주세요
            </h1>
            <p className="text-gray-600 leading-relaxed">
              당신의 사진에 담긴 감정과 의미를 깊이 있게 나누어 보세요.
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
              dragActive 
                ? 'border-gray-400 bg-gray-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              사진을 업로드하세요
            </h3>
            <p className="text-gray-600 mb-6">
              드래그 앤 드롭하거나 클릭하여 파일을 선택하세요
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white hover:bg-gray-800"
            >
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-4">
              JPG, PNG 파일을 지원합니다 (최대 {UPLOAD_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB)
            </p>
            {errors.file && (
              <p className="text-red-600 text-sm mt-2">{errors.file}</p>
            )}
          </div>
        </div>
      ) : (
        /* Edit Area */
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="space-y-6">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentImage.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors duration-200 ${
                        index === currentImageIndex 
                          ? 'border-black' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image.preview}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </button>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors duration-200"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              )}

              {/* Preview Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">미리보기</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={currentImage.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-black mb-2">
                      {currentImage.title.trim() || "Untitled"}
                    </h4>
                    {currentImage.description.trim() && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                        {currentImage.description}
                      </p>
                    )}
                    {currentImage.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {currentImage.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user?.profileImage} alt={user?.username} />
                          <AvatarFallback className="text-xs">
                            {user?.username?.[0] || '나'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">
                          {user?.username || '내 이름'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  제목
                </Label>
                <Input
                  id="title"
                  value={currentImage.title}
                  onChange={(e) => updateImage(currentImageIndex, { title: e.target.value })}
                  placeholder="사진의 제목을 입력하세요 (선택사항)"
                  className="mt-2 border-gray-300 focus:border-gray-500 focus:ring-0"
                  maxLength={UPLOAD_CONSTANTS.MAX_TITLE_LENGTH}
                />
                <p className="text-xs text-gray-500 mt-1">
                  빈칸으로 두면 'Untitled'로 표시됩니다
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  이야기
                </Label>
                <Textarea
                  id="description"
                  value={currentImage.description}
                  onChange={(e) => updateImage(currentImageIndex, { description: e.target.value })}
                  placeholder="이 사진에 담긴 감정과 의미를 깊이 있게 들려주세요. (선택사항)"
                  rows={8}
                  className="mt-2 border-gray-300 focus:border-gray-500 focus:ring-0 resize-none"
                  maxLength={UPLOAD_CONSTANTS.MAX_DESCRIPTION_LENGTH}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {currentImage.description.length}/{UPLOAD_CONSTANTS.MAX_DESCRIPTION_LENGTH}자
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  태그
                </Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {currentImage.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(currentImageIndex, tag)}
                          className="ml-1 hover:text-gray-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(currentImageIndex);
                        }
                      }}
                      placeholder="태그 입력 후 Enter"
                      className="border-gray-300 focus:border-gray-500 focus:ring-0"
                      disabled={currentImage.tags.length >= UPLOAD_CONSTANTS.MAX_TAGS}
                    />
                    <Button
                      type="button"
                      onClick={() => addTag(currentImageIndex)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:border-gray-400"
                      disabled={currentImage.tags.length >= UPLOAD_CONSTANTS.MAX_TAGS}
                    >
                      추가
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    사진과 관련된 키워드를 추가하여 다른 사용자들이 쉽게 찾을 수 있도록 해주세요.
                    (최대 {UPLOAD_CONSTANTS.MAX_TAGS}개)
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {images.length}개의 사진 준비됨
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-gray-300 text-gray-700 hover:border-gray-400"
                    >
                      사진 추가
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || images.length === 0}
                      className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isUploading ? `업로드 중... ${uploadProgress}%` : '게시하기'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Progress Modal */}
      <Modal
        isOpen={isUploading}
        onClose={() => {}}
        showCloseButton={false}
        className="max-w-sm"
      >
        <div className="text-center">
          <Camera className="w-12 h-12 text-black mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">
            사진 이야기를 업로드하는 중...
          </h3>
          <p className="text-gray-600 mb-6">
            잠시만 기다려주세요.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {uploadProgress}% 완료
          </p>
        </div>
      </Modal>
    </div>
  );
}