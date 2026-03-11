"use client"
import Card from "../../components/Card"

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Login">
        <form className="flex flex-col gap-3">
          <input type="email" placeholder="Email" className="border p-2 rounded"/>
          <input type="password" placeholder="Password" className="border p-2 rounded"/>
          <button className="bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </Card>
    </div>
  )
}