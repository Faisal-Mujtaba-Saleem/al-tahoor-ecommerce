"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface FramerWrapperProps {
    children: React.ReactNode;
    className?: string;
    y?: number;
    x?: number;
    delay?: number;
    duration?: number;
    scale?: number;
}

const FramerWrapper = ({
    children,
    className,
    y = 20,
    x = 0,
    delay = 0,
    duration = 0.5,
    scale = 1,
}: FramerWrapperProps) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: y, x: x, scale: scale }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay, duration: duration }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default FramerWrapper;
