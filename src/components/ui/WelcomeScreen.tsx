import React, { useEffect, useState } from "react";
import Image from "next/image";

const WelcomeScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 3000);
    const start = Date.now();
    const duration = 3000;
    const update = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      if (elapsed < duration) requestAnimationFrame(update);
    };
    update();
    return () => {
      clearTimeout(timer);
      setProgress(0);
    };
  }, [onFinish]);
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #ffffff 60%, #3b82f6 100%)' }} />
      <Image src="/Tambo-Lockup.svg" alt="Tambo Logo" fill className="absolute inset-0 w-full h-full object-cover z-10 blur-2xl opacity-40" />
      <div className="absolute inset-0 z-20 backdrop-blur-2xl bg-white/60" />
      <div className="relative z-30 flex flex-col items-center justify-center w-full">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl skew-y-3">
          <span className="text-5xl font-bold text-white">H</span>
        </div>
        <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-white mb-2 tracking-tight">MediHealth CRM</h1>
        <p className="text-xl text-gray-500 dark:text-gray-300 mb-8 font-light">Management System for Modern Healthcare Institutions</p>
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner mt-2">
          <div
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
