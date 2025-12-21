import Link from "next/link";

export default function CartCheckoutCard({
  totalCents,
}: {
  totalCents: number;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-xs">
      <div className="bg-white border rounded-xl shadow-lg p-4 flex flex-col gap-3 items-center">
        <div className="flex items-center justify-between w-full">
          <span className="text-base">Cart total</span>
          <span className="font-semibold">
            €{(totalCents / 100).toFixed(2)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-black px-4 py-3 text-center text-white text-sm rounded-lg hover:opacity-80 transition-opacity"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
}
