import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DASHBOARD_PATH } from "../constants/roles";
import GradientMesh from "../components/ui/GradientMesh";
import Button from "../components/ui/Button";

export default function WelcomeSplash() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const goToDashboard = () => {
    navigate(DASHBOARD_PATH[user.role] || "/citizen", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-center">
      <GradientMesh />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-2 text-3xl font-bold text-foreground sm:text-4xl"
        >
          👋 Welcome, {user.name || "there"}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 max-w-md text-base text-muted"
        >
          CiviTrack helps you report, track, and resolve civic issues in your
          community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button onClick={goToDashboard} size="lg">
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
