"use client";
import { UserButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const UserButtonWrapper = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <UserButton />;
};

export default UserButtonWrapper;
