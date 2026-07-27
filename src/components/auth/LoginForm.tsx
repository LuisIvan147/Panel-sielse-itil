"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [LoginError, setLoginError] = useState("")

    const Router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
            Router.push("/dashboard");
        } else {
            setLoginError("Usuario o contraseña incorrectos")
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm p-4 border rounded-lg shadow-md">

            <h1 className="text-2xl font-bold text-center gap">Iniciar sesión</h1>
            <label htmlFor="username">Ingrese su nombre de usuario</label>
            <input type="text" id="username" value={username}

                onChange={(event) => { setUsername(event.target.value); setUsernameError(""); console.log("", event.target.value) }}

                required autoComplete="username" className="border border-gray-500 rounded-md py-2 px-3 " />
            {usernameError && (<p className="mt-[-10px] text-sm text-red-600">{usernameError}</p>)}
            <label htmlFor="password">Ingrese su contraseña</label>
            <input type="password" id="password" value={password}

                onChange={(event) => { setPassword(event.target.value); setPasswordError(""); console.log("", event.target.value) }}

                required autoComplete="current-password" className="border border-gray-500 rounded-md py-2 px-3 " />
            {passwordError && (<p className="mt-[-10px] text-sm text-red-600">{passwordError}</p>)}
            <button type="submit" className="border mt-3 border-black bg-black text-white py-2 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-100">Entrar </button>
            <p className="mt-[-10px] text-center text-sm text-red-600">{LoginError}</p>
            {/*<p>{username}</p>*/}
        </form>

    )
}