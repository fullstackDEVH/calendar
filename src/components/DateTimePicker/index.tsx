import { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: string) => void;
}

const DateTimePicker = ({ value, onChange }: DatePickerProps) => {
  const datepickerRef = useRef<any>(null);

  useEffect(() => {
    if (datepickerRef.current) {
      datepickerRef.current.setOpen(true);
    }
  }, []);

  const handleChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toLocaleDateString();
      onChange(formattedDate);
    }
  };

  return (
    <DatePicker
      ref={datepickerRef}
      selected={value}
      minDate={new Date()}
      onChange={handleChange}
      timeIntervals={15}
      dateFormat="Pp"
      inline
    />
  );
};

export default DateTimePicker;
