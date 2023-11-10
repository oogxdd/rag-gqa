export const Button = ({
  children,
  type,
  onClick,
  loading,
  size = "default",
}) => {
  let className = "";
  let sizeClassName = "py-2 px-4";

  if (type === "primary") {
    className = "bg-blue-700 text-white";
  }

  if (type === "secondary") {
    className = "bg-amber-300 text-gray-900";
  }

  if (type === "subtle") {
    className = "bg-gray-50 text-gray-700 border-gray-300 border";
  }

  if (size === "sm") {
    sizeClassName = "py-1 px-4";
  }

  return (
    <button
      className={`rounded-full ${sizeClassName} ${className} hover:opacity-80`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
