interface ButtonProps {
  onClick: () => void;
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="bg-seductive hover:bg-accent text-white hover:text-black font-bold py-2 px-4 rounded"
    >
      {label}
    </button>
  );
};
