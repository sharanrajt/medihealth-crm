"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    action?: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, action?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success", action?: string) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts((prev) => [...prev, { id, message, type, action }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success": return <IconCheck size={18} />;
            case "error": return <IconX size={18} />;
            case "warning": return <IconAlertTriangle size={18} />;
            case "info": return <IconInfoCircle size={18} />;
        }
    };

    const getStyles = (type: ToastType) => {
        switch (type) {
            case "success": return "from-emerald-500 to-teal-600 text-white shadow-emerald-500/30";
            case "error": return "from-red-500 to-rose-600 text-white shadow-red-500/30";
            case "warning": return "from-amber-500 to-orange-600 text-white shadow-amber-500/30";
            case "info": return "from-blue-500 to-indigo-600 text-white shadow-blue-500/30";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className={`pointer-events-auto bg-gradient-to-r ${getStyles(toast.type)} px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[420px] backdrop-blur-sm border border-white/10`}
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                {getIcon(toast.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                {toast.action && (
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                                        {toast.action}
                                    </p>
                                )}
                                <p className="text-sm font-medium leading-snug">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <IconX size={12} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
