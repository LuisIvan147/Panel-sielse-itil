"use client"
import { useState } from "react";

export default function LoginForm() {
    const [username, setUsername] = useState("");

    return (
        <form className="flex flex-col gap-3 w-full max-w-sm p-4 border rounded-lg shadow-md">

            <h1 className="text-2xl font-bold text-center gap">Iniciar sesión</h1>
            <label htmlFor="username">Ingrese su nombre de usuario</label>
                <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" className="border border-gray-500 rounded-md py-2 px-3 " />
            <label htmlFor="password">Ingrese su contraseña</label>
                <input type="password" id="password" required  autoComplete="current-password" className="border border-gray-500 rounded-md py-2 px-3 "/>
            <button type="submit" className="border mt-3 border-black bg-black text-white py-2 px-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">Entrar </button>
                    <p>{username}</p>
        </form>

    )
}