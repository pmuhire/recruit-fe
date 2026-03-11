interface TableProps {
    headers: string[]
    data: any[] // later we can type
  }
  
  export default function Table({ headers, data }: TableProps) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t">
                {headers.map((h, i) => (
                  <td key={i} className="px-4 py-2">{row[h.toLowerCase()]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }