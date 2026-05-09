import React from "react";
import Card from "../components/JobCard";

export default function Reports() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Time to Hire (Avg)"> <div className="text-xl font-bold">12 days</div> </Card>
        <Card title="Interviewer Load"> <div className="text-xl font-bold">Moderate</div> </Card>
      </div>
      <div className="mt-4 text-sm text-slate-500">
        Placeholder charts — integrate recharts / chart.js later for visuals.
      </div>
    </div>
  );
}
