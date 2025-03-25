export function Button({ children, className, ...props }) {
    return (
      <button
        className={`bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }