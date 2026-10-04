import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Camera, X, ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { uploadImage } from '../../services/api';
import { compressImage } from '../../utils/imageCompressor';

export default function StepPhoto({
  platform,
  product,
  imageUrl,
  onImageUploaded,
  onNext,
  onBack,
}) {
  const [preview, setPreview] = useState(imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const platformName = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : 'Marketplace';

  const handleFileSelect = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(rawFile.type)) {
      setUploadError('Invalid format. Please upload a JPG, PNG, or WEBP screenshot.');
      return;
    }

    if (rawFile.size > 16 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size allowed is 16MB.');
      return;
    }

    setUploadError(null);
    setPreview(URL.createObjectURL(rawFile));

    try {
      setOptimizing(true);
      setUploading(true);

      // Instant client-side ultra compression down to 25KB-45KB WebP
      const compResult = await compressImage(rawFile, { maxWidth: 800, maxHeight: 1000, quality: 0.65 });
      const optimizedFile = compResult.file || compResult;
      if (compResult.savedPercent > 0) {
        setCompressionStats(compResult);
      }
      setOptimizing(false);

      const res = await uploadImage(optimizedFile);
      if (res.success && res.url) {
        onImageUploaded(res.url);
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError('Could not upload screenshot. Please check connection and try again.');
    } finally {
      setOptimizing(false);
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setCompressionStats(null);
    onImageUploaded('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProceed = () => {
    if (!preview) {
      setUploadError('Please upload your review screenshot before continuing.');
      return;
    }
    setUploadError(null);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-none"
    >
      <div className="text-center space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-900 leading-tight">
          UPLOAD SCREENSHOT PROOF
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Attach the screenshot showing your 5-star rating on <span className="font-bold text-stone-900">{platformName}</span>.
        </p>
      </div>

      {uploadError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs text-center font-mono-tech font-bold">
          {uploadError}
        </div>
      )}

      {/* Upload Box or Preview Frame */}
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-stone-300 hover:border-black hover:bg-stone-50 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 bg-stone-50/50 shadow-xs group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 text-black flex items-center justify-center group-hover:scale-110 group-hover:border-black transition-all shadow-xs">
            <Camera size={28} />
          </div>
          <div className="space-y-1">
            <p className="font-display font-bold text-stone-900 text-sm sm:text-base uppercase tracking-tight">
              Tap to Upload {platformName} Screenshot
            </p>
            <p className="text-stone-400 font-mono-tech text-xs">
              Supports JPG, PNG, WEBP from your phone photo gallery (Max 8MB)
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech font-bold uppercase tracking-wider px-5 py-2.5 rounded-full bg-black text-white shadow-xs group-hover:bg-stone-800 transition-colors">
              <UploadCloud size={15} />
              <span>SELECT SCREENSHOT</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const demoUrl = 'https://images.meesho.com/images/products/441454363/1ep00_512.avif?width=512';
                setPreview(demoUrl);
                onImageUploaded(demoUrl);
                setUploadError(null);
              }}
              className="text-[11px] font-mono-tech font-bold uppercase tracking-wider px-3.5 py-2 rounded-full border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Use Sample Proof
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border-2 border-black bg-stone-950 aspect-[4/3] max-h-80 flex items-center justify-center shadow-lg">
          <img
            src={preview}
            alt="Review screenshot preview"
            className="w-full h-full object-contain"
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2.5 z-10">
              <Loader2 size={34} className="animate-spin text-amber-400" />
              <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-center px-4">
                {optimizing ? '⚡ Optimizing Proof for Fast Upload...' : '🔒 Securely Uploading Proof...'}
              </span>
              <span className="text-[10px] text-stone-400 font-mono-tech">
                Scaled for instant 50k+ user submissions
              </span>
            </div>
          )}

          {!uploading && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>ATTACHED</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-full bg-white/90 hover:bg-white text-black text-xs font-mono-tech font-bold uppercase tracking-wider backdrop-blur-md shadow-sm transition-colors cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
                aria-label="Remove screenshot"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {compressionStats && !uploading && (
            <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono-tech flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Sparkles size={13} />
                Compressed {compressionStats.savedPercent}%
              </span>
              <span className="text-stone-300">
                {compressionStats.originalKb} KB ➔ <strong className="text-white">{compressionStats.compressedKb} KB</strong> (Instant)
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Screenshot Verification Checklist */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2 text-xs text-stone-800">
        <div className="flex items-center gap-2 font-bold text-amber-900 font-mono-tech uppercase text-[11px]">
          <ShieldCheck size={16} className="text-amber-600 shrink-0" />
          <span>INSTANT APPROVAL CHECKLIST // PHOTO REQUIREMENT</span>
        </div>
        <ul className="space-y-1.5 list-disc pl-5 text-[11px] text-stone-700 leading-normal font-mono-tech">
          <li><strong>Product Photo in Review</strong>: Screenshot me 5-star rating ke saath product ki real photo attached dikhni chahiye (Photo reviews ko instant approval milta hai).</li>
          <li><strong>5-Star Rating Visible</strong>: Full 5 stars rating rating bar me clearly visible honi chahiye.</li>
          <li><strong>Verified Purchase Tag</strong>: Marketplace account ya verified buyer status frame me hona chahiye.</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>BACK</span>
        </button>

        <button
          type="button"
          disabled={uploading}
          onClick={handleProceed}
          className="flex-1 py-3.5 px-6 rounded-full font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-widest bg-black hover:bg-stone-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <span>CONTINUE TO CLAIM REWARDS</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
