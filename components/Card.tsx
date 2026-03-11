interface CardProps {
    title: string
    children: React.ReactNode
  }
  
  export default function Card({ title, children }: CardProps) {
    return (
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {children}
      </div>
    )
  }