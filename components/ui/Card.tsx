type CardProps = {
  title: string
  value: string | number
}

export default function Card({ title, value }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  )
}