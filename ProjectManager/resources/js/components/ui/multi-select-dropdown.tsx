import { useState } from "react";

export interface Items {
    id: number;
    name: string;
}

interface MultiSelectDropdownProps {
    items: Items[];
    selected: number[];
    onChange: (ids: number[]) => void;
}

const MultiSelectDropdown = (props: MultiSelectDropdownProps) => {
    const { items, selected, onChange } = props;
    const [open, setOpen] = useState(false);

    const toggle = (id: number) => {
        onChange(
            selected.includes(id)
                ? selected.filter(x => x !== id)
                : [...selected, id]
        );
    };

    return (
        <div className="relative w-64">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full border px-3 py-2 rounded bg-[#1e2939] text-left "
            >
                {selected.length === 0
                    ? "Select items..."
                    : items
                        .filter(item => selected.includes(item.id))
                        .map(item => item.name)
                        .join(", ")
                }
            </button>

            {open && (
                <div className="absolute z-10 mt-1 w-full border rounded bg-[#1e2939] shadow p-2">
                    {items.map(item => (
                        <label
                            className="flex items-center gap-2 py-1 cursor-pointer"
                            key={item.id}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(item.id)}
                                onChange={() => toggle(item.id)}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelectDropdown;
