"use client";

interface Column {
  key: string;
  label: string;
  isStatus?: boolean;
}

interface ApplicationsTableProps {
  columns: Column[];
  data: Record<string, any>[];
}

export default function ApplicationsTable({ columns, data }: ApplicationsTableProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
      <table className="min-w-full table-auto border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase tracking-wide text-left">
            {columns.map((col) => (
              <th key={col.key} className="p-3 border-b border-gray-200">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`transition hover:bg-gray-50 cursor-pointer ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {columns.map((col) => {
                  const value = row[col.key];

                  // Status badge
                  if (col.isStatus) {
                    return (
                      <td key={col.key} className="p-3 border-b border-gray-200">
                        <span
                          className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
                            value === "Approved"
                              ? "bg-green-600"
                              : value === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-600"
                          }`}
                        >
                          {value}
                        </span>
                      </td>
                    );
                  }

                  // Format appliedAt directly
                  if (col.key === "appliedAt") {
                    return (
                      <td key={col.key} className="p-3 border-b border-gray-200">
                        {new Date(value).toLocaleDateString()}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className="p-3 border-b border-gray-200">
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-6 text-gray-500 font-medium"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}