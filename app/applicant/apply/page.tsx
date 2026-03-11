"use client"

export default function ApplyPage(){

  return (

    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-6">
        Submit Application
      </h2>

      <label className="block mb-2">Upload CV</label>

      <input
        type="file"
        className="border p-2 rounded w-full mb-4"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Application
      </button>

    </div>

  )
}