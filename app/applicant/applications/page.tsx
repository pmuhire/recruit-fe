import Table from "../../../components/ui/Table"
import StatusBadge from "../../../components/ui/StatusBadge"
import Button from "../../../components/ui/Button"

export default function ApplicationsPage() {

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Applications
      </h1>

      <Table
        headers={[
          "Applicant",
          "NID",
          "Status",
          "Submitted",
          "Actions"
        ]}
      >

        <tr className="border-t">
          <td className="p-3">John Doe</td>
          <td className="p-3">119988001122</td>
          <td className="p-3">
            <StatusBadge status="pending" />
          </td>
          <td className="p-3">2026-03-11</td>

          <td className="p-3 flex gap-2">
            <Button>View</Button>
            <Button variant="danger">Reject</Button>
          </td>
        </tr>

      </Table>

    </div>
  )
}