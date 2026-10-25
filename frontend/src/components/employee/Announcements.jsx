import React from "react";
import { useFetch, fmtDate } from "../../utils/hooks";

export default function Announcements() {
  const { data: announcements, loading: loadingAnn } = useFetch("/announcements");
  const { data: trainings, loading: loadingTrain } = useFetch("/trainings");

  // Fallback demo training matching Image 4
  const displayTrainings =
    trainings && trainings.length > 0
      ? trainings
      : [
          {
            _id: "demo-training",
            title: "MongoDB CRUD",
            description: "This Training Session is based on the MongoDB CRUD Operation.",
            trainer: "Adnan Saif",
            date: "2025-11-05",
          },
        ];

  return (
    <div className="employee-overview-grid">
      {/* Announcements Card */}
      <div className="portal-card">
        <h3 className="card-header-title">Announcements</h3>
        <div className="card-content-area">
          {announcements && announcements.length > 0 ? (
            <div className="announcements-list">
              {announcements.map((a) => (
                <div key={a._id} className="announcement-item">
                  <div className="announcement-head">
                    <h4>{a.title}</h4>
                    <span className="muted-text small-text">{fmtDate(a.createdAt)}</span>
                  </div>
                  <p className="announcement-body">{a.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-muted-text">No announcements available.</p>
          )}
        </div>
      </div>

      {/* Trainings Card */}
      <div className="portal-card">
        <h3 className="card-header-title">Trainings</h3>
        <div className="card-content-area">
          <div className="trainings-list">
            {displayTrainings.map((t) => (
              <div key={t._id} className="training-item-card">
                <h4 className="training-title">{t.title}</h4>
                <p className="training-desc">{t.description}</p>
                <div className="training-meta">
                  <span className="training-trainer">Trainer: {t.trainer || "Instructor"}</span>
                  <span className="training-date">Date: {t.date ? fmtDate(t.date) : "05 Nov 2025"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
