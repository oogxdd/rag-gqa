export const Checkbox = ({ label, value, onChange }) => (
  <div className="flex items-center ml-0 cursor-pointer hover:opacity-90">
    <input
      type="checkbox"
      checked={value}
      onChange={onChange}
      name="save-answer"
      className="h-4 w-4 rounded border-gray-300 text-blue-500 cursor-pointer"
    />
    <label
      className="ml-1.5 text-gray-700 text-sm cursor-pointer"
      htmlFor="save-answer"
      onClick={onChange}
    >
      {label}
    </label>
  </div>
);
