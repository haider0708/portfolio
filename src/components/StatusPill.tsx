import type { Status } from "../data/projects";

const tone: Record<Status, string> = {
  Live: "live",
  Production: "live",
  "Production-oriented": "gold",
  "In development": "blue",
  Internship: "silver",
  Academic: "silver",
  Built: "silver",
};

const StatusPill = ({ status }: { status: Status }) => (
  <span className={`status-pill status-${tone[status]}`}>
    <span className="status-dot" aria-hidden="true"></span>
    {status}
  </span>
);

export default StatusPill;
