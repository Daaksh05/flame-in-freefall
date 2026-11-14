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
          d="M12 2.5c.6 2.4-.4 3.9-1.8 5.4-1.6 1.7-2.9 3.3-2.9 5.6a4.7 4.7 0 0 0 9.4 0c0-1.2-.4-2.1-1-3 .1 1.3-.4 2.2-1.1 2.8-.2-1.6-1-2.5-2-3.4-.7-.6-.9-1.5-.6-2.4.3.5.9.9 1.5 1 .2-2.3-.7-4.1-1.5-6Z"
          fill="url(#flame-core-shared)"
          fillOpacity="0.9"
        />
        <defs>
          <linearGradient id="flame-core-shared" x1="12" y1="2.5" x2="12" y2="18.6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
