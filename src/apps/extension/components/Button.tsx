// interface

// export const Button = () => {
//   <button
//     type="submit"
//     className="justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
//   >
//     {isLoading ? <Loader /> : "Save Settings"}
//   </button>;
// };

interface ButtonProps {
  onClick: () => void;
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="bg-seductive hover:bg-accent text-black font-bold py-2 px-4 rounded"
    >
      {label}
    </button>
  );
};
