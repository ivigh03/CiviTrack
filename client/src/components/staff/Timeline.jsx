export default function Timeline({ status }) {
  const steps = ["assigned", "in-progress", "completed"];

  return (
    <div className="timeline">
      {steps.map((step, i) => (
        <span
          key={i}
          className={`step ${
            steps.indexOf(status) >= i ? "active" : ""
          }`}
        >
          {step}
        </span>
      ))}
    </div>
  );
}