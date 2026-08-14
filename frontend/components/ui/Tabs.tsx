export function Tabs<Key extends string>({
  tabs,
  activeKey,
  onChange,
}: {
  tabs: { key: Key; label: string }[];
  activeKey: Key;
  onChange: (key: Key) => void;
}) {
  return (
    <div role="tablist" className="mb-6 flex gap-1 border-b border-[#dedee9] dark:border-[#2d2d38]">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "border-[#315bd8] text-[#315bd8] dark:border-[#8aa4ff] dark:text-[#8aa4ff]"
                : "border-transparent text-[#696977] hover:text-[#34343c] dark:text-[#9797a6] dark:hover:text-[#e5e5eb]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
