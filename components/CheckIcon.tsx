/** Decorative check mark for lists; the text beside it carries the meaning. */
export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}
