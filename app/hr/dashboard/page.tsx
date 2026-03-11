import Card from "../../../components/ui/Card"

export default function DashboardPage() {

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Card
          title="Total Applications"
          value="124"
        />

        <Card
          title="Approved"
          value="40"
        />

        <Card
          title="Pending Review"
          value="84"
        />

      </div>

    </div>
  )
}