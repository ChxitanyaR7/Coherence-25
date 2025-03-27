export function Card({ children, className }) {
  return (
    <div
      className={`rounded-lg shadow-md ${className} overflow-hidden`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div
      className={`p-2 ${className} overflow-y-auto`}
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      {children}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .${className}::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
