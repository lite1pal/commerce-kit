import Link from "next/link";

export default function CartCheckoutCard({
  totalCents,
}: {
  totalCents: number;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-xs">
      <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded-xl shadow-lg p-4 flex flex-col gap-3 items-center transition-colors">
        <div className="flex items-center justify-between w-full">
          <span className="text-base">Cart total</span>
          <span className="font-semibold">
            €{(totalCents / 100).toFixed(2)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-black dark:bg-white px-4 py-3 text-center text-white dark:text-black text-sm rounded-lg hover:opacity-80 transition-opacity"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
}
