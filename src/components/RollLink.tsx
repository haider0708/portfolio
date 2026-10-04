import "./styles/RollLink.css";

/**
 * A label that rolls up on hover to reveal a gold copy of itself.
 * The duplicate is decorative and hidden from assistive tech.
 */
const RollLink = ({ label }: { label: string }) => (
  <span className="roll" data-cursor="hide">
    <span className="roll__track">
      <span className="roll__face">{label}</span>
      <span className="roll__face roll__face--alt" aria-hidden="true">
        {label}
      </span>
    </span>
  </span>
);

export default RollLink;
