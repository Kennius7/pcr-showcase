
"use client";

import { useState } from "react";
// import { auth } from "../firebase";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock, X, User } from "lucide-react";
import { handleAuth } from "../services/api";

interface SignInSignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    setIsLoggedIn: (value: boolean) => void;
    onAuthSuccess?: () => void; // Made optional with default
}

export default function SignInSignUpModal({ 
    isOpen, 
    onClose, 
    setIsLoggedIn, 
    onAuthSuccess 
}: SignInSignUpModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleAuthFunction = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        try {
            let authResult;
            
            if (isSignUp) {
                authResult = await handleAuth("SIGNUP", email, password, name);
            } else {
                authResult = await handleAuth("SIGNIN", email, password, "", setIsLoggedIn);
            }
            
            // Check if authentication was successful
            // You may need to adjust this based on what your handleAuth function returns
            if (authResult && authResult.success !== false) {
                setIsLoggedIn(true);
                
                // Clear form fields
                setName("");
                setEmail("");
                setPassword("");
                setError("");
                
                // Close modal
                onClose();
                
                // Trigger refresh callback after successful authentication
                if (onAuthSuccess) {
                    // Small delay to ensure auth state is properly set
                    setTimeout(() => {
                        onAuthSuccess();
                    }, 100);
                }
            } else {
                // Handle authentication failure
                setError(authResult?.message || "Authentication failed. Please try again.");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form when switching between sign in/sign up
    const handleToggleMode = () => {
        setIsSignUp(!isSignUp);
        setName("");
        setEmail("");
        setPassword("");
        setError("");
    };

    // Reset form when modal closes
    const handleClose = () => {
        setName("");
        setEmail("");
        setPassword("");
        setError("");
        setIsSignUp(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl relative">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-4 text-gray-500 hover:text-red-500 cursor-pointer"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    </div>
                )}

                <form onSubmit={handleAuthFunction} className="space-y-4">
                    {isSignUp && (
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500">
                            <User className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="flex-1 outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    )}

                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500">
                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="flex-1 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500">
                        <Lock className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Password"
                            className="flex-1 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <div 
                            className={`w-4 h-4 rounded-full cursor-pointer transition-colors
                            ${isPasswordVisible ? "bg-red-500" : "bg-green-500"}
                            ${isLoading ? "opacity-50 cursor-not-allowed" : "animate-pulse hover:opacity-80"}`}
                            onClick={() => !isLoading && setIsPasswordVisible(!isPasswordVisible)}
                        ></div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-lg transition font-medium
                        ${isLoading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                    >
                        {isLoading 
                            ? (isSignUp ? "Signing Up..." : "Signing In...") 
                            : (isSignUp ? "Sign Up" : "Sign In")
                        }
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={handleToggleMode}
                        disabled={isLoading}
                        className={`text-blue-600 hover:underline cursor-pointer
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}
