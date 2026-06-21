import { useState } from "react";

export default function Tabs({ tabs = [], defaultTab = 0 }) {
  const [active, setActive] = useState(defaultTab);

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            className={`tab-btn ${active === i ? "tab-btn--active" : ""}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
