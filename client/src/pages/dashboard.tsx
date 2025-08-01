import Navigation from "@/components/navigation";
import ProgressDashboard from "@/components/progress-dashboard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <ProgressDashboard />
    </div>
  );
}
