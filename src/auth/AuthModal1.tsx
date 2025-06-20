
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
    onAuthSuccess: () => void;
}

export default function SignInSignUpModal({ isOpen, onClose, setIsLoggedIn, onAuthSuccess }: SignInSignUpModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    if (!isOpen) return null;

    const handleAuthFunction = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError("");
        try {
            if (isSignUp) {
                handleAuth("SIGNUP", email, password, name);
            } else {
                handleAuth("SIGNIN", email, password, "", setIsLoggedIn );
            }
            // onClose(); // close modal on success
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-4 text-gray-500 hover:text-red-500 cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h2>

                {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}

                <form onSubmit={handleAuthFunction} className="space-y-4">
                    {
                        isSignUp && (
                            <div className="flex items-center border rounded-lg px-3 py-2">
                                <User className="w-4 h-4 text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="flex-1 outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )
                    }

                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="flex-1 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Lock className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type={isPasswordVisible ? "password" : "text"}
                            placeholder="Password"
                            className="flex-1 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div 
                            className={`w-4 h-4 rounded-full animate-pulse 
                            ${isPasswordVisible ? "bg-red-500" : "bg-green-500"}`}
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        ></div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}

