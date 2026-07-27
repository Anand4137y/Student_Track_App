import React from "react";

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  permission: "approved" | "rejected" | "requested";
  createdAt: string;
}

export interface SchoolData {
  role: string;
  _id: string;
  schoolName: string ;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  schoolCode: string;
  district: string;
  status: string;
  permission: string;
  isEnabled: boolean;
  staff: StaffMember[];
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="text-sm font-medium text-gray-900" title={value}>
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );
}

function SchoolProfile({ data }: { data: SchoolData | null }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getBadgeColor = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      requested: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const approvedStaff = data.staff.filter((s) => s.permission === "approved");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-xl mb-2 shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.schoolName}</h1>
            <p className="text-gray-500 font-medium mt-1">School Code: {data.schoolCode}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* School Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              School Details
            </h3>
            <div className="space-y-5">
              <InfoItem label="Email" value={data.email} />
              <InfoItem label="Phone" value={data.phone} />
              <InfoItem label="Address" value={data.address} />
              <InfoItem label="City" value={data.city} />
              <InfoItem label="District" value={data.district} />
              <InfoItem label="State" value={data.state} />
              <InfoItem label="PIN Code" value={data.pinCode} />
            </div>
          </div>
        </div>

        {/* Staff Members */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                Approved Staff ({approvedStaff.length})
              </h3>
            </div>
            <div className="overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedStaff.length > 0 ? (
                    approvedStaff.map((staff) => (
                      <tr key={staff._id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{staff.name}</td>
                        <td className="px-6 py-4 text-gray-600">{staff.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            staff.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {staff.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-16 text-gray-500">
                        No approved staff members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolProfile;