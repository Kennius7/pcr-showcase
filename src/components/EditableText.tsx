
import React, { useState, useRef } from 'react';
import { type EditableTextProps } from '../utils/types';



const EditableText: React.FC<EditableTextProps> = ({
    value,
    onChange,
    className = "",
    multiline = false,
    placeholder = "",
    allowImageUpload = false,
    cloudinaryConfig,
    toggleEdit
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadToCloudinary = async (file: File): Promise<string> => {
        if (!cloudinaryConfig) {
            throw new Error('Cloudinary configuration is required for image uploads');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url;
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file');
            return;
        }

        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const imageUrl = await uploadToCloudinary(file);
            
            // Insert image markdown at cursor position or append
            const imageMarkdown = `![${file.name}](${imageUrl})`;
            const newValue = value ? `${value}\n${imageMarkdown}` : imageMarkdown;
            onChange(newValue);
            
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    if (toggleEdit) {
        return (
            <div className="w-full">
                {multiline ? (
                    <textarea
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={`border border-gray-300 rounded px-2 py-1 w-full resize-none ${className}`}
                        placeholder={placeholder}
                        rows={3}
                    />
                ) : (
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={`border border-gray-300 rounded px-2 py-1 w-full ${className}`}
                        placeholder={placeholder}
                    />
                )}
                
                {allowImageUpload && cloudinaryConfig && (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleImageButtonClick}
                            disabled={isUploading}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    📷 Add Image
                                </>
                            )}
                        </button>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        
                        {uploadError && (
                            <span className="text-red-500 text-sm">{uploadError}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
    
    return <span className={className}>{value}</span>;
};

export default EditableText;
