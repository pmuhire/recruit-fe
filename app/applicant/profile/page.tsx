"use client"

export default function ProfileForm() {

  return (

    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-6">
        Applicant Profile
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input placeholder="NID Number" className="border p-2 rounded"/>

        <input placeholder="First Name" className="border p-2 rounded"/>

        <input placeholder="Last Name" className="border p-2 rounded"/>

        <input placeholder="Phone" className="border p-2 rounded"/>

        <input placeholder="Email" className="border p-2 rounded"/>

        <input type="date" className="border p-2 rounded"/>

      </div>

      <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">
        Save Profile
      </button>

    </div>

  )
}