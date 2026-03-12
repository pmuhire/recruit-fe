"use client";

interface TableColumn {
  key: string;
  label: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  statusKey?: string; // optional key to color status
}

export default function Table({ columns, data, statusKey }: TableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            {columns.map((col) => (
              <th key={col.key} className="p-3 border">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                No data available
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              {columns.map((col) => {
                const value = row[col.key];
                let style = "";
                if (statusKey && col.key === statusKey) {
                  style =
                    value === "Approved"
                      ? "text-green-600 font-semibold"
                      : value === "Pending"
                      ? "text-yellow-600 font-semibold"
                      : "text-red-600 font-semibold";
                }
                return (
                  <td key={col.key} className={`p-2 border ${style}`}>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}