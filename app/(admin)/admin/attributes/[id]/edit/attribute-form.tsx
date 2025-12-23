"use client";

import { useState } from "react";
import {
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../../actions";
import { useFormStatus } from "react-dom";

type AttributeFormProps = {
  attribute: {
    id: string;
    name: string;
    values: {
      id: string;
      value: string;
    }[];
  };
};

export default function AttributeForm({ attribute }: AttributeFormProps) {
  const [editingName, setEditingName] = useState(false);

  return (
    <>
      <section className="mb-6 rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Name</h2>
        {editingName ? (
          <form action={updateAttribute} className="flex gap-2">
            <input type="hidden" name="id" value={attribute.id} />
            <input
              name="name"
              defaultValue={attribute.name}
              className="border px-3 py-2 rounded w-64"
            />
            <SubmitButton label="Save" />
            <button
              type="button"
              className="border rounded px-3"
              onClick={() => setEditingName(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium">{attribute.name}</span>
            <button
              onClick={() => setEditingName(true)}
              className="text-sm text-blue-600"
            >
              Edit
            </button>
          </div>
        )}
      </section>

      <section className="mb-6 rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Values</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {attribute.values.length === 0 && (
            <p className="text-sm text-gray-500">No values yet.</p>
          )}

          {attribute.values.map((v) => (
            <div
              key={v.id}
              className="group flex items-center rounded-full border px-3 py-1 text-sm"
            >
              <form action={updateAttributeValue} className="flex items-center">
                <input type="hidden" name="id" value={v.id} />
                <input
                  name="value"
                  defaultValue={v.value}
                  className="bg-transparent w-20 focus:outline-none"
                />
                <button className="ml-1 hidden group-hover:inline text-blue-600">
                  ✓
                </button>
              </form>

              <form
                action={deleteAttributeValue}
                onSubmit={(e) => {
                  if (!confirm("Delete this value?")) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={v.id} />
                <button className="ml-1 hidden group-hover:inline text-red-500">
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={createAttributeValue} className="flex gap-2">
          <input type="hidden" name="attributeId" value={attribute.id} />
          <input
            name="value"
            placeholder="New value"
            className="border px-3 py-2 rounded"
            required
          />
          <SubmitButton label="Add" />
        </form>
      </section>

      <section className="rounded-xl border border-red-300 p-4">
        <h2 className="font-semibold text-red-600 mb-2">Danger zone</h2>
        <form
          action={deleteAttribute}
          onSubmit={(e) => {
            if (!confirm("Delete attribute and ALL values?")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={attribute.id} />
          <button className="border border-red-500 text-red-600 px-4 py-2 rounded">
            Delete attribute
          </button>
        </form>
      </section>
    </>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
