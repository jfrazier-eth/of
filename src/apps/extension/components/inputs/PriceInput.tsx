import { ChangeEvent } from "react";

interface PriceInputProps {
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

const PriceInput: React.FC<PriceInputProps> = ({ price, setPrice }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setPrice(0);
    } else {
      setPrice(value);
    }
  };
  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0"
          aria-describedby="price-currency"
          value={price}
          onChange={handleChange}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceInput;
