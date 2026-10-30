import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/navigation/Sidebar";
import { OrbitalReadinessScene } from "@/components/3d/OrbitalReadinessScene";
import {
  WorkoutRecommendationCard,
  NutritionLedgerCard,
  TrainingRhythmCard,
} from "@/components/dashboard/DashboardCards";
import { getAthleteProfile, getScopedKey } from "@/lib/user-store";
import { getOverallBodymapReadiness } from "@/lib/fitness-data";

export default function Home() {
  const [, setLocation] = useLocation();

  const getGreetingPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "MORNING";
    if (hour >= 12 && hour < 17) return "AFTERNOON";
    if (hour >= 17 && hour < 21) return "EVENING";
    return "NIGHT";
  };

  const [greetingWord, setGreetingWord] = useState(getGreetingPeriod());
  const [userName, setUserName] = useState(() => {
    const profile = getAthleteProfile();
    return (profile.name?.split(" ")[0] || "ATHLETE").toUpperCase();
  });
  const [readinessData, setReadinessData] = useState(() => getOverallBodymapReadiness());
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
      const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      setFormattedTime(`${day} • ${time}`);
      setGreetingWord(getGreetingPeriod());
      setReadinessData(getOverallBodymapReadiness());

      const profile = getAthleteProfile();
      if (profile.name && profile.name.trim()) {
        const first = profile.name.trim().split(" ")[0];
        setUserName(first.toUpperCase());
      }
    };

    updateTimeAndGreeting();

    const handleRecoveryUpdate = () => {
      setReadinessData(getOverallBodymapReadiness());
    };

    window.addEventListener("fittrack:recovery-update", handleRecoveryUpdate);
    window.addEventListener("storage", handleRecoveryUpdate);
    window.addEventListener("focus", handleRecoveryUpdate);
    const interval = setInterval(updateTimeAndGreeting, 10000);

    return () => {
      window.removeEventListener("fittrack:recovery-update", handleRecoveryUpdate);
      window.removeEventListener("storage", handleRecoveryUpdate);
      window.removeEventListener("focus", handleRecoveryUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="editorial-app-shell">
      <Sidebar />

      <main className="editorial-main-content">
        {/* TOP HERO SECTION */}
        <section className="editorial-hero-grid">
          {/* Left Hero Column: Typography & Actions */}
          <div className="editorial-hero-left">
            <div className="editorial-timestamp">
              {formattedTime || "TUESDAY • 01:16 PM"}
            </div>

            <h1 className="editorial-greeting-title">
              GOOD<br />
              {greetingWord},<br />
              <span className="greeting-athlete">{userName}</span>
            </h1>

            <div className="editorial-action-row">
              <button
                className="editorial-primary-btn"
                onClick={() => setLocation("/start-session")}
              >
                <span>BEGIN TODAY'S SESSION</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="editorial-secondary-link"
                onClick={() => setLocation("/exercise-library")}
              >
                View training plan
              </button>
            </div>

            {/* Score & Telemetry Indicator */}
            <div className="editorial-score-block">
              <div className="editorial-score-badge">
                <span className="score-number" style={{ color: readinessData.color, textShadow: `0 0 20px ${readinessData.color}59` }}>{readinessData.score}</span>
                <div className="score-denom">
                  <span className="denom-val">/ 100</span>
                  <span className="denom-label">READINESS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: 3D Orbital Readiness Form */}
          <div className="editorial-hero-right">
            <OrbitalReadinessScene score={readinessData.score} />
          </div>
        </section>

        {/* BOTTOM 3-CARD TELEMETRY GRID */}
        <section className="editorial-bottom-grid">
          <WorkoutRecommendationCard />
          <NutritionLedgerCard />
          <TrainingRhythmCard />
        </section>
      </main>
    </div>
  );
}
