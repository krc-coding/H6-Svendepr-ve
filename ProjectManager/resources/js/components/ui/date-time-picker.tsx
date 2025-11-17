import { useState } from "react";

interface DateTimePickerProps {
    setDateTime: (dateTime: string) => void;
}

const DateTimePicker = (props: DateTimePickerProps) => {
    const { setDateTime } = props;
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");

    const updateDateTime = (newDate: string, newTime: string) => {
        if (newDate && newTime) {
            setDateTime(`${newDate}T${newTime}:00`);
        }
    };

    return (
        <div>
            <label className="block mb-1 font-semibold">Due date</label>
            <input

                type="date"
                onChange={(e) => {
                    const d = e.target.value;
                    setDate(d);
                    updateDateTime(d, time);
                }}
            />
            &emsp;
            <input
                type="time"
                onChange={(e) => {
                    const t = e.target.value;
                    setTime(t);
                    updateDateTime(date, t);
                }}
            />
        </div>
    );
}

export default DateTimePicker;
