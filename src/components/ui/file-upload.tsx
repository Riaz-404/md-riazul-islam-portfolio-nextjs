"use client";

import React, { useState, useRef } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  value?: File[];
  onChange: (files: File[]) => void;
  className?: string;
  required?: boolean;
  description?: string;
}

export function FileUpload({
  label,
  accept = "image/*",
  multiple = false,
  value = [],
  onChange,
  className = "",
  required = false,
  description,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (multiple) {
      onChange([...value, ...fileArray]);
    } else {
      onChange([fileArray[0]]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const openFileSelector = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}

      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600 hover:border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-sm font-medium">
              Drop files here or{" "}
              <span className="text-primary hover:underline cursor-pointer">
                click to browse
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {accept === "image/*" ? "PNG, JPG, GIF up to 10MB" : accept}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files Preview */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected Files:</Label>
          <div className="grid grid-cols-1 gap-2">
            {value.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {file.type.startsWith("image/") ? (
                    <div className="relative w-8 h-8">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      {file.type.startsWith("image/") && (
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          width={32}
                          height={32}
                          className="absolute inset-0 w-8 h-8 object-cover rounded"
                          onLoad={(e) => {
                            URL.revokeObjectURL(
                              (e.target as HTMLImageElement).src
                            );
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
