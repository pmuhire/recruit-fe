type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    type?: "button" | "submit"
    variant?: "primary" | "secondary" | "danger"
  }
  
  export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
  }: ButtonProps) {
  
    const styles = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    }
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 rounded ${styles[variant]}`}
      >
        {children}
      </button>
    )
  }