/**
 * 100KG Performance OS — Home Command Center
 * Thin UI controller powered by reactive athlete & recovery stores.
 */

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
import { useAthleteStore, useRecoveryStore } from "@/state";
import { formatTelemetryTimestamp, getGreetingPeriod } from "@/utils/date";

export default function Home() {
  const [, setLocation] = useLocation();
  const { profile } = useAthleteStore();
  const { readiness } = useRecoveryStore();

  const [formattedTime, setFormattedTime] = useState(() => formatTelemetryTimestamp());
  const [greetingWord, setGreetingWord] = useState(() => getGreetingPeriod());

  const userName = (profile.name?.split(" ")[0] || "ATHLETE").toUpperCase();

  useEffect(() => {
    const timer = setInterval(() => {
      setFormattedTime(formatTelemetryTimestamp());
      setGreetingWord(getGreetingPeriod());
    }, 15000);
    return () => clearInterval(timer);
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
              {formattedTime}
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
                <span
                  className="score-number"
                  style={{
                    color: readiness.color,
                    textShadow: `0 0 20px ${readiness.color}59`,
                  }}
                >
                  {readiness.score}
                </span>
                <div className="score-denom">
                  <span className="denom-val">/ 100</span>
                  <span className="denom-label">READINESS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: 3D Orbital Readiness Form */}
          <div className="editorial-hero-right">
            <OrbitalReadinessScene score={readiness.score} />
          </div>
        </section>

        {/* 3-COLUMN METRIC WIDGETS */}
        <section className="editorial-cards-grid">
          <WorkoutRecommendationCard />
          <NutritionLedgerCard />
          <TrainingRhythmCard />
        </section>
      </main>
    </div>
  );
}
