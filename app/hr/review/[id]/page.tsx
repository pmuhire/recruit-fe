export default function ReviewPage(){

    return(
    
    <div className="bg-white p-6 rounded shadow max-w-3xl">
    
    <h2 className="text-xl font-bold mb-4">
    Review Application
    </h2>
    
    <p><b>Name:</b> Alice Johnson</p>
    <p><b>NID:</b> 123456789</p>
    
    <a
    href="#"
    className="text-blue-600 underline block my-4"
    >
    Download CV
    </a>
    
    <textarea
    placeholder="Reason"
    className="border p-2 w-full mb-4"
    />
    
    <div className="flex gap-4">
    
    <button className="bg-green-600 text-white px-4 py-2 rounded">
    Approve
    </button>
    
    <button className="bg-red-600 text-white px-4 py-2 rounded">
    Reject
    </button>
    
    </div>
    
    </div>
    
    )
    }