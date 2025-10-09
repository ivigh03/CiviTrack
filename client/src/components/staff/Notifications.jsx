export default function Notifications({ notifications }) {
  return (
    <div className="notifications">
      <h3>🔔 Notifications</h3>

      {notifications.map((n, i) => (
        <div key={i} className="notification">
          {n}
        </div>
      ))}
    </div>
  );
}