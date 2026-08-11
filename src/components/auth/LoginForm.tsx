"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoEyeSharp, IoEyeOff } from "react-icons/io5";

export default function LoginForm() {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault();
        setUsernameError("");
        setPasswordError("");
        setLoginError("");

        if (!username.trim()) {
            setUsernameError("El nombre de usuario es obligatorio");
            return;
        }
        if (password.trim().length < 4) {
            setPasswordError("La contraseña debe de tener al menos 4 caracteres");
            return;
        }

        if (username === 'Mateo' && password === '1234') {
            localStorage.setItem("user", username);
            localStorage.setItem("isAuthenticated", "true");
            router.push("/dashboard");
        } else {
            setLoginError("Usuario o contraseña incorrectos")
        }
    };

    return (
    <div className="login-container">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm p-4 border rounded-lg shadow-md">

            <h1 className="text-2xl font-bold text-center gap">Iniciar sesión</h1>
            <label htmlFor="username">Ingrese su nombre de usuario</label>
            <input 
                type="text" id="username" value={username}
                onChange={(event) => { setUsername(event.target.value); setUsernameError(""); }}

                required autoComplete="username" className="border border-gray-500 rounded-md py-2 px-3 " />
            {usernameError && (<p className="mt-[-10px] text-sm text-red-600">{usernameError}</p>)}
            <label htmlFor="password">Ingrese su contraseña</label>
            <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
                }}
                required
                autoComplete="current-password"
                className="w-full border border-gray-500 rounded-md py-2 px-3 pr-12"
            />

            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {showPassword ? (
                <IoEyeOff size={25} />
                ) : (
                <IoEyeSharp size={25} />
                )}
            </button>
            </div>
            {passwordError && (<p className="mt-[-10px] text-sm text-red-600">{passwordError}</p>)}
            <button type="submit" className="border mt-3 border-black bg-black text-white py-2 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-100">Entrar </button>
            
            <p className="mt-[-10px] text-center text-sm text-red-600">{loginError}</p>
            {/*<p>{username}</p>*/}
            <p>{password}</p>
        </form>
    </div>
    )
    
}
