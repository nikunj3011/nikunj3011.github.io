type IconName = 'external' | 'down' | 'up' | 'refresh';

const paths: Record<IconName, string> = {
  external: 'M5 19 19 5M5 5h14v14',
  down: 'M12 4v16M5 13l7 7 7-7',
  up: 'M12 20V4M5 11l7-7 7 7',
  refresh: 'M20 7v5h-5M19.1 12a7.2 7.2 0 1 0-1.8 5.5M20 12l-2.5-4',
};

export default function Icon({ name = 'external' }: { name?: IconName }) {
  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
