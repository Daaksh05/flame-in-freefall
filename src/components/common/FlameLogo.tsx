export function FlameLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${className}`}
      style={{ background: "linear-gradient(145deg, #FB923C 0%, #EA580C 55%, #9A3412 100%)" }}
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2.5c.6 2.4-.4 3.9-1.8 5.4-1.6 1.7-2.9 3.3-2.9 5.6a4.7 4.7 0 0 0 9.4 0c0-1.2-.4-2.1-1-3 .1 1.3-.4 2.2-1.1 2.8-.2-1.6-1-2.5-2-3.4-.7-.6-.9-1.5-.6-2.4.3.5.9.9 1.5 1 .2-2.3-.7-4.1-1.5-6Z"
          fill="#FFEDD5"
        />
        <path
          d="M12 7.4c.4 1.5-.2 2.5-1.1 3.4-1 1.1-1.8 2.1-1.8 3.6a3 3 0 0 0 6 0c0-.8-.2-1.3-.6-1.9.1.8-.2 1.4-.7 1.8-.1-1-.6-1.6-1.3-2.2-.4-.4-.5-1-.4-1.5.2.3.6.6 1 .6.1-1.5-.4-2.6-1.1-3.8Z"
          fill="url(#flame-core-shared)"
        />
        <defs>
          <linearGradient id="flame-core-shared" x1="12" y1="7.4" x2="12" y2="17.2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
