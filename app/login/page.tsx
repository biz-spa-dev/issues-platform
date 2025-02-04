"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const users = [
  { name: "Ben", password: "password123" },
  { name: "Rebecca", password: "password123" },
  { name: "Shuli", password: "password123" },
  { name: "Roi", password: "password123" },
  { name: "Adir", password: "password123" },
  { name: "Shlomi", password: "password123" },
  { name: "Sergey", password: "password123" },
]

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const user = users.find((u) => u.name === username && u.password === password)

    if (user) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("currentUser", user.name)
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-xs space-y-4">
        <Input name="username" placeholder="Username" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">
          Login
        </Button>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </form>
    </div>
  )
}

