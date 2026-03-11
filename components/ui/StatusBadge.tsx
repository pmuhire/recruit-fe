type StatusProps = {
    status: "approved" | "pending" | "rejected" | "review"
  }
  
  export default function StatusBadge({ status }: StatusProps) {
  
    const styles = {
      approved: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
      review: "bg-blue-100 text-blue-700",
    }
  
    return (
      <span className={`px-2 py-1 text-sm rounded ${styles[status]}`}>
        {status}
      </span>
    )
  }