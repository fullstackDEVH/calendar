import { Select } from "antd";

import heartIcon from "../../assets/heart.svg";
import clockIcon from "../../assets/clock.svg";
import backIcon from "../../assets/arrow-left.svg";
import arrowRightIcon from "../../assets/arrow_next.svg";
import arrowBottomIcon from "../../assets/arrow_bottom_grey.svg";
import DateTimePicker from "../DateTimePicker";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import useElementClickOutSide from "../../hooks/useElementClickOutSide";

interface IOption {
  label: string;
  value: string;
}

interface IProps {
  service: {
    value: string[];
    options: IOption[];
    onChange: (items: string[]) => void;
  };
  resource: {
    value: number | null;
    options: IOption[];
    onChange: (items: string) => void;
  };
  dateTime: {
    value: Date | null;
    onChange: (value: Date) => void;
  };
  handleCreateEvent: () => void;
  handleClear: () => void;
}

const Controller = ({
  service,
  resource,
  dateTime,
  handleCreateEvent,
  handleClear,
}: IProps) => {
  const [visibleDateTime, setVisibleDateTime] = useState<boolean>(false);

  const dateTimeRef = useRef<HTMLDivElement>(null);

  useElementClickOutSide(
    dateTimeRef,
    () => {
      if (visibleDateTime) setVisibleDateTime(false);
    },
    [visibleDateTime]
  );

  return (
    <div className="bg-[#F2F4F7] px-1 py-2">
      <div className="px-4">
        <div className="flex items-center">
          <div className="bg-white rounded-lg flex items-center justify-center border border-[#D0D5DD] w-[90px] h-[40px] gap-1">
            <img src={backIcon} alt={backIcon} width={20} height={20} />
            <span className="text-sm font-semibold text-[#344054]">Back</span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="flex flex-col gap-1 items-end">
              <div className="border-[1.5px] border-[#032A94] rounded-full bg-white py-1 px-[10px] flex gap-1 box-content">
                <img src={clockIcon} alt={clockIcon} width={12} height={12} />
                <span className="text-txt-primary text-[16px] leading-5 font-medium">
                  9:00 - 20:00
                </span>
              </div>
              <div className="border-[1.5px] border-[#032A94] rounded-full bg-white py-1 px-[10px] box-content">
                <span className="text-txt-primary text-[16px] leading-5 font-medium">
                  Days off: Thurs, Sat
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4">
                <span className="text-[#101828] text-[32px] leading-[30px] font-semibold">
                  Nail salon ABC, Texas
                </span>
                <img
                  src={arrowBottomIcon}
                  alt={arrowBottomIcon}
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-[#65558F] text-[20px] leading-[30px]">
                110 Hillvue Ln, Butler, PA 16001, Tesax
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 py-[10px] ">
        <div className="w-full bg-white rounded-lg py-[6px] h-14 flex justify-center items-center gap-3">
          <input
            type="text"
            value={"+21 2302 9764"}
            className="outline-none border border-[#D0D5DD] rounded-lg text-[#101828] h-[40px] px-[14px] w-full max-w-[145px] font-medium"
          />
          <input
            type="text"
            value={"David"}
            className="outline-none border border-[#D0D5DD] rounded-lg text-[#101828] h-[40px] px-[14px] w-full max-w-[171px] font-medium"
          />
          <div className="border border-[#D0D5DD] rounded-lg text-[#344054] h-[40px] px-[14px] w-fit font-medium grid place-items-center cursor-pointer">
            Today
          </div>

          <div className="flex">
            <div className="p-2 rounded cursor-pointer hover:-translate-x-1 transition-transform">
              <img
                src={arrowRightIcon}
                alt={arrowRightIcon}
                width={24}
                height={24}
                className="rotate-180"
              />
            </div>
            <div className="p-2 rounded cursor-pointer hover:translate-x-1 transition-transform">
              <img
                src={arrowRightIcon}
                alt={arrowRightIcon}
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className="relative z-50 max-w-[220px] w-full">
            <div
              ref={dateTimeRef}
              className="group/date flex gap-[6px] items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setVisibleDateTime((pre) => !pre);
              }}
            >
              <span className="text-[#475467] text-[18px] leading-6 font-semibold">
                {dayjs(dateTime.value ?? new Date()).format(
                  "ddd, MMMM D, YYYY"
                )}
              </span>
              <div className="p-2 rounded cursor-pointer group-hover/date:rotate-90 transition-transform">
                <img
                  src={arrowRightIcon}
                  alt={arrowRightIcon}
                  width={24}
                  height={24}
                  className="rotate-90"
                />
              </div>
            </div>

            {visibleDateTime ? (
              <div className="absolute top-full right-0 w-[330px]">
                <DateTimePicker
                  value={dateTime.value}
                  onChange={(value) => value && dateTime.onChange(value)}
                />
              </div>
            ) : null}
          </div>

          <Select
            allowClear
            rootClassName="text-[#1F2636] max-w-[160px] w-full"
            className="h-[40px]"
            placeholder="Select resource"
            suffixIcon={
              <img
                src={arrowRightIcon}
                alt={arrowRightIcon}
                width={24}
                height={24}
                className="rotate-90"
              />
            }
            value={resource.value ? `${resource.value}` : null}
            onChange={resource.onChange}
            options={resource.options}
          />

          <Select
            allowClear
            mode="multiple"
            rootClassName="text-[#1F2636] max-w-[196px] w-full"
            className="h-[40px]"
            placeholder="Choose services"
            maxTagCount={1}
            suffixIcon={
              <img
                src={arrowRightIcon}
                alt={arrowRightIcon}
                width={24}
                height={24}
                className="rotate-90"
              />
            }
            value={service.value}
            onChange={service.onChange}
            options={service.options}
          />

          <div
            className="bg-[#032A94] rounded-lg px-3 py-2 cursor-pointer hover:opacity-85 transition-opacity"
            onClick={handleCreateEvent}
          >
            <img src={heartIcon} alt={heartIcon} width={24} height={24} />
          </div>

          <p
            className="text-txt-primary text-sm font-semibold underline leading-5 cursor-pointer hover:translate-x-1 transition-transform"
            onClick={handleClear}
          >
            Clear
          </p>
        </div>
      </div>
    </div>
  );
};

export default Controller;
