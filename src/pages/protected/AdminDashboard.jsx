import { FaPlay } from "react-icons/fa";
import Header from "../../components/admin-dashboard/Header";
import TabMenu from "../../components/admin-dashboard/TabMenu";
import AdminDashboardLayout from "@/components/admin-dashboard/admin-dashboard-layout";

export default function AdminDashboard() {
  return (
    <div className="h-full w-[100dvw]">
      <AdminDashboardLayout>
        {/* Header */}
        <Header />
        {/* Tab Menu */}
        <TabMenu />
        {/* Session Details */}
        <div className="rounded-md bg-white p-4">
          <div className="mt-4">
            <h3 className="font-semibold">Subjective:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Reports feeling sad due to ongoing situation in Palestine</li>
              <li>
                Describes feeling exhausted, tired, experiencing frequent
                illness
              </li>
              <li>Reports survivor’s guilt regarding safety</li>
              <li>Mentally unstable while watching events</li>
              <li>Reports being criticized for appearance</li>
              <li>Lost long-term friendships due to situation</li>
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Past Medical History:</h3>
            <p className="text-sm text-gray-700">
              Reports recent illness lasting 2 weeks
            </p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Objective:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Presents as articulate, engaged</li>
              <li>Tearful when discussing grandmother</li>
              <li>Good insight into personal growth and values</li>
              <li>Strong sense of identity and purpose evident</li>
            </ul>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-4 flex items-center justify-between p-4">
          <button className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white">
            <FaPlay className="mr-2" /> Start Recording
          </button>
          <button className="rounded-md bg-gray-200 px-4 py-2">Results</button>
        </div>
      </AdminDashboardLayout>
    </div>
  );
}
