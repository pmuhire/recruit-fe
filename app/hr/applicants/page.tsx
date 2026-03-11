export default function ApplicantsPage(){

    const applicants = [
    {name:"Alice"},
    {name:"Bob"},
    {name:"Carol"},
    {name:"David"},
    {name:"Eva"},
    {name:"Frank"},
    {name:"Grace"},
    {name:"Henry"},
    {name:"Isla"},
    {name:"John"},
    ]
    
    return (
    
    <div className="bg-white p-6 rounded shadow">
    
    <h2 className="text-xl font-bold mb-4">
    Latest Applicants
    </h2>
    
    <div className="overflow-x-auto">
    
    <table className="w-full">
    
    <thead className="bg-gray-100">
    
    <tr>
    <th>Name</th>
    <th>Action</th>
    </tr>
    
    </thead>
    
    <tbody>
    
    {applicants.map((a,i)=>(
    <tr key={i} className="border-t">
    
    <td className="p-2">{a.name}</td>
    
    <td>
    
    <button className="bg-blue-600 text-white px-2 py-1 rounded">
    View
    </button>
    
    </td>
    
    </tr>
    ))}
    
    </tbody>
    
    </table>
    
    </div>
    
    </div>
    
    )
    }