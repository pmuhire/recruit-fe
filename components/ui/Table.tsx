type TableProps = {
  headers: string[]
  children: React.ReactNode
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <table className="w-full">

        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left p-3 text-sm font-semibold text-gray-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {children}
        </tbody>

      </table>
    </div>
  )
}