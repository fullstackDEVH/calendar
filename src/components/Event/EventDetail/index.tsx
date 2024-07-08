import trashIcon from "../../../assets/trash.svg";
import editIcon from "../../../assets/edit.svg";
import { IEvent } from "../../../App";

interface EventProps {
  event: IEvent;
  startTime: string;
  endTime: string;
  isEventamp: boolean;
  services: { name: string }[];
  chooseEvent: IEvent | null;
  setChooseEvent: (event: IEvent) => void;
  myEvents: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  popupRef: React.RefObject<HTMLDivElement>;
}

const CustomEventComponent: React.FC<EventProps> = ({
  event,
  startTime,
  endTime,
  services,
  chooseEvent,
  setChooseEvent,
  myEvents,
  setEvents,
  popupRef,
  isEventamp,
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setChooseEvent(event);
      }}
      className={`eventCustom h-full relative flex items-center justify-center shadow-md ${
        isEventamp ? "bg-white outline-4 outline-[#D6BBFB]" : "bg-[#DAE9F8]"
      } border-l-4 rounded-lg border-[#6941C6]`}
    >
      <div className="flex flex-col items-center gap-1">
        <h4 className="text-txt-primary text-[14px] font-semibold leading-[17px]">
          {startTime} - {endTime}
        </h4>
        <p className="text-[#2C2C2C] font-bold text-[14px] line-clamp-1 break-all">
          {event.data.userInfor.username}
        </p>
        <div className="flex flex-wrap items-center justify-center w-full">
          <p className="text-[14px] font-medium leading-[17px] text-[#344054]">
            {services.map((service) => service.name).join(", ")}
          </p>
        </div>
      </div>
      {chooseEvent?.id === event.id &&
      myEvents.find((ev) => ev.id === chooseEvent?.id) ? (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: 0,
            right: "calc(100% + 4px)",
          }}
        >
          <div className="w-[256px] rounded-lg bg-white overflow-hidden shadow-[2px_2px_8px_0px_rgba(0,0,0,0.25)]">
            {/* heading */}
            <div className="bg-[#21005D] h-8 flex items-center gap-[10px] p-2">
              <p className="text-[14px] font-bold text-[#EAECF0]">
                {startTime} - {endTime}
              </p>

              <div className="flex-1 flex justify-between items-center">
                <p className="text-[14px] font-bold text-[#EAECF0]">Booked</p>
                <div className="flex gap-2">
                  <img
                    src={editIcon}
                    alt={editIcon}
                    width={16}
                    height={16}
                    onClick={(e) => {
                      e.preventDefault();
                      alert("edit");
                    }}
                    className="hover:rotate-[30deg] transition-transform"
                  />
                  <img
                    src={trashIcon}
                    alt={trashIcon}
                    width={16}
                    height={16}
                    onClick={(e) => {
                      e.preventDefault();
                      setEvents((prevEvents) =>
                        prevEvents.filter((ev) => ev.id !== chooseEvent?.id)
                      );
                    }}
                    className="hover:rotate-[30deg] transition-transform"
                  />
                </div>
              </div>
            </div>

            {/* body */}
            <div className="mt-3 ">
              <div className="px-4 flex items-center gap-2">
                <h4 className="text-[20px] font-bold text-[#101828]">
                  David Tran
                </h4>
                <span className="text-[14px] font-semibold text-[#667085]">
                  +21 2302 9764
                </span>
              </div>

              {/* price */}
              <div className="mt-[10px]">
                <div className="px-4 py-1 flex justify-between items-center">
                  <div>
                    <h4 className="text-[14px] font-medium leading-5 text-[#101828]">
                      Polish
                    </h4>
                    <p className="text-[12px] font-semibold text-[#475467]">
                      1h
                    </p>
                  </div>
                  <span className="text-[14px] font-medium text-[#101828]">
                    $60
                  </span>
                </div>

                <div className="px-4 py-1 flex justify-between items-center">
                  <div>
                    <h4 className="text-[14px] font-medium leading-5 text-[#101828]">
                      Polish
                    </h4>
                    <p className="text-[12px] font-semibold text-[#475467]">
                      1h
                    </p>
                  </div>
                  <span className="text-[14px] font-medium text-[#101828]">
                    $60
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomEventComponent;
