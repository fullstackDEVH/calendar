import { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value: Date | null;
  onChange: (
    date: Date | null
    // event: React.SyntheticEvent<any> | undefined
  ) => void;
}
const DateTimePicker = ({ value, onChange }: DatePickerProps) => {
  const datepickerRef = useRef<any>(null);

  useEffect(() => {
    if (datepickerRef.current) {
      datepickerRef.current.setOpen(true);
    }
  }, []);

  return (
    <DatePicker
      ref={datepickerRef}
      selected={value}
      minDate={new Date()}
      minTime={new Date()}
      maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
      onChange={onChange}
      showTimeSelect
      timeIntervals={15}
      dateFormat="Pp"
      inline
    />
  );
};

export default DateTimePicker;
