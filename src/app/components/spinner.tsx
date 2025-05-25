export default function Spinner() {
  return (
      <div className="flex justify-center items-center">
        <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6184d8]" // Adjust size and color as needed
        ></div>
      </div>
  );
}
