import { useEffect, useRef, useState } from "react";

export interface Items {
    id: number;
    name: string;
    show: boolean;
}

interface MultiSelectDropdownProps {
    items: Items[];
    selected: number[];
    onChange: (ids: number[]) => void;
}

const MultiSelectDropdown = (props: MultiSelectDropdownProps) => {
    const { items, selected, onChange } = props;
    const [open, setOpen] = useState(false);
    const [openAbove, setOpenAbove] = useState(false);
    const [visibleItems, setVisibleItems] = useState<Items[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVisibleItems(items.filter(item => item.show));
    }, [items]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setOpen(false);
        }
    }

    const handleOpen = () => {
        if (!buttonRef.current) return;

        const itemHeight = 32;          // In pixels
        const maxWindowHeight = 0.6;    // In percent

        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = Math.min(items.length * itemHeight, window.innerHeight * maxWindowHeight);

        setOpenAbove(spaceBelow < dropdownHeight);
        setOpen(o => !o);
    };

    const getSelectedItems = (): String => {
        return items
            .filter(item => selected.includes(item.id))
            .map(item => item.name)
            .join(", ")
    }

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
                ref={buttonRef}
                type="button"
                onClick={handleOpen}
                className="w-full border px-3 py-2 rounded bg-[#1e2939] text-left"
            >
                {selected.length === 0 ? "Select items..." : getSelectedItems()}
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className={`
                        absolute z-10 w-full border rounded bg-[#1e2939] 
                        shadow p-2 overflow-y-auto max-h-[60vh] 
                        ${openAbove ? "bottom-full mb-1" : "top-full mt-1"}
                    `}
                >

                    {visibleItems.length === 0 ?
                        (
                            <label className="flex items-center">
                                No items
                            </label>
                        ) :
                        items.map(item => (
                            item.show ? (
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
                            ) : null
                        ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelectDropdown;
