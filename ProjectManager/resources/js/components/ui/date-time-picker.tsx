import { useState } from "react";

interface DateTimePickerProps {
    firstTimeRender: string | null;
    setDateTime: (dateTime: string) => void;
}

const DateTimePicker = (props: DateTimePickerProps) => {
    const { firstTimeRender, setDateTime } = props;

    let oldDate = "";
    let oldTime = "";
    if (firstTimeRender) {
        try {
            // This will fail when it is just created, diffence format
            const [oldDateRaw, oldFullTime] = firstTimeRender.split(" ");
            oldDate = oldDateRaw;
            oldTime = oldFullTime.slice(0, 5);
        }
        catch {
            const [oldDateRaw, oldFullTime] = firstTimeRender.split("T");
            oldDate = oldDateRaw;
            oldTime = oldFullTime.slice(0, 5);
        }
    }

    const [date, setDate] = useState<string>(oldDate);
    const [time, setTime] = useState<string>(oldTime);

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
                value={date}
                onChange={(e) => {
                    const d = e.target.value;
                    setDate(d);
                    updateDateTime(d, time);
                }}
            />
            &emsp;
            <input
                type="time"
                value={time}
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
