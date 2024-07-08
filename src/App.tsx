import { Calendar, EventProps, View, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Heading from "./components/Heading";
import Summary from "./components/Summary";
import Controller from "./components/Controller";
import avatarIcon from "./assets/Avatar.png";
import slideNextIcon from "./assets/slide_next.svg";
import slidePreviousIcon from "./assets/slide_previous.svg";

import CustomEventComponent from "./components/Event/EventDetail";
import EventBlocked from "./components/Event/EventBlocked";
import { message } from "antd";

const localizer = dayjsLocalizer(dayjs);

export interface IService {
  name: string;
  time: string;
}

export interface IResource {
  resourceId: number;
  resourceTitle: string;
  data: { name: string; avatar: string };
}

const servicesData: IService[] = [
  { name: "Gel Mani", time: "30 min" },
  { name: "Pedi", time: "20 min" },
  { name: "Polish Nails", time: "60 min" },
  { name: "Hands", time: "45 min" },
  { name: "Toes", time: "90 min" },
];

const resourceMap: IResource[] = [
  {
    resourceId: 1,
    resourceTitle: "David Ryan",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 2,
    resourceTitle: "Cris C7",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 3,
    resourceTitle: "Neymar.JR",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 4,
    resourceTitle: "K.Debroyne",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 5,
    resourceTitle: "KAKA",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 6,
    resourceTitle: "Ronadinho",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 7,
    resourceTitle: "Gullit",
    data: { name: "name", avatar: avatarIcon },
  },
  {
    resourceId: 8,
    resourceTitle: "Ballack",
    data: { name: "name", avatar: avatarIcon },
  },
];

export interface IEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId: number | number[];
  data: {
    services: IService[];
    userInfor: {
      username: string;
      phone: string;
    };
  };
}

const MyCalendar = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [skip] = useState<number>(4);
  const [page, setPage] = useState<number>(1);

  const [inputUserName, setInputUserName] = useState<string>("");
  const [inputPhone, setInputPhone] = useState<string>("");

  const [myEvents, setEvents] = useState<IEvent[]>(() => {
    const savedEvents = localStorage.getItem("myEvents");
    const eventParse: IEvent[] = savedEvents ? JSON.parse(savedEvents) : [];
    const convertDate = eventParse.map((event) => ({
      ...event,
      start: dayjs(event.start).toDate(),
      end: dayjs(event.end).toDate(),
    }));
    return convertDate;
  });

  const [event, setEvent] = useState<IEvent | null>(null);
  const [chooseEvent, setChooseEvent] = useState<IEvent | null>(null);

  const [resource, setResource] = useState<IResource[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [selectectedResource, setSelectedResource] = useState<number | null>(
    null
  );
  const [selectedService, setSelectedServices] = useState<IService[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().toDate().toLocaleDateString()
  );
  const [time, setSelectedTime] = useState<string>("");

  const wrapperCalendarRef = useRef(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResource(resourceMap.slice((page - 1) * skip, page * skip));
  }, [page, skip]);

  useEffect(() => {
    localStorage.setItem("myEvents", JSON.stringify(myEvents));
  }, [myEvents]);

  useEffect(() => {
    if (event) {
      setEvent(null);
    }
    if (
      !selectedDate ||
      !time ||
      !selectectedResource ||
      selectedService.length < 1 ||
      !inputUserName ||
      !inputPhone
    )
      return;

    const combineDateTime = (date: string, time: string) => {
      const dateFormats = ["DD/MM/YYYY", "M/D/YYYY"];
      const parsedDate = dayjs(date, dateFormats, true);

      if (!parsedDate.isValid()) {
        alert("Invalid date format");
        return;
      }

      const combinedDateTime = parsedDate.format("YYYY-MM-DD") + `T${time}:00`;

      return dayjs(combinedDateTime).toDate();
    };

    const startDay = combineDateTime(selectedDate, time);
    if (!startDay) return;
    const totalMinutes = selectedService.reduce((acc, service) => {
      const minutes = parseInt(service.time.split(" ")[0], 10);
      return acc + minutes;
    }, 0);
    const endDay = dayjs(startDay).add(totalMinutes, "minute").toDate();

    setEvent({
      id: Math.floor(Math.random() * 10001),
      title: "title",
      start: startDay,
      end: endDay,
      resourceId: selectectedResource,
      data: {
        services: selectedService,
        userInfor: {
          phone: inputPhone,
          username: inputUserName,
        },
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDate,
    time,
    selectectedResource,
    selectedService,
    inputPhone,
    inputUserName,
  ]);

  const handleClear = useCallback(() => {
    setEvent(null);
    setSelectedServices([]);
    setSelectedTime("");
    setInputPhone(""), setInputUserName("");
    if (!isMobile) setSelectedResource(null);
  }, [isMobile]);

  useEffect(() => {
    if (selectedDate) {
      handleClear();
    }
  }, [selectedDate, handleClear]);

  const calcTop = useCallback((dateString: string) => {
    const startOfDay = dayjs().startOf("day");
    const selectedDayjs = dayjs(
      `${dayjs().format("YYYY-MM-DD")}T${dateString}`
    );
    const diffMinutes = selectedDayjs.diff(startOfDay, "minute");

    let newTotal;
    if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      newTotal = hours * 100 + (remainingMinutes / 60) * 100;
    } else {
      newTotal = (diffMinutes / 60) * 100;
    }
    return { persontage: (newTotal / 2400) * 100, distance: newTotal };
  }, []);

  useEffect(() => {
    const container = document.querySelector(".rbc-time-content");
    if (!container) return;

    const isSameDate = dayjs(selectedDate).isSame(dayjs(), "day")
      ? true
      : false;
    if (!isSameDate)
      container?.scrollTo({
        top: 700,
        behavior: "smooth",
      });
  }, [selectedDate]);

  useEffect(() => {
    const columns = document.querySelectorAll(".rbc-day-slot.rbc-time-column");
    const container = document.querySelector(".rbc-time-content");
    if (columns.length < 1 || !container) return;

    columns.forEach((column) => {
      const existingDiv = column.querySelector("#rbc-current-time-from");
      if (existingDiv) {
        column.removeChild(existingDiv);
      }
    });

    if (time) {
      const possitionTop = calcTop(time);

      container?.scrollTo({
        top: possitionTop.distance - 50,
        behavior: "smooth",
      });
      const newDiv = document.createElement("div");
      newDiv.id = "rbc-current-time-from";
      newDiv.style.position = "absolute";
      newDiv.style.zIndex = "4";
      newDiv.style.left = "0";
      newDiv.style.right = "0";
      newDiv.style.height = "3px";
      newDiv.style.background = "#EF6820";
      newDiv.style.top = `${possitionTop.persontage}%`;

      columns.forEach((column) => {
        column.appendChild(newDiv.cloneNode(true));
      });
    }
  }, [time, calcTop]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    const element = wrapperCalendarRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 888) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      }
    });

    resizeObserver.observe(element);
    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const content = formatTime(new Date());

      const wrapper: HTMLElement | null = document.querySelector(
        ".rbc-time-gutter.rbc-time-column + .rbc-day-slot.rbc-time-column"
      );
      if (isMobile && !selectectedResource) return;

      const isSameDate = isSameDay(
        dayjs().toDate(),
        selectedDate ? dayjs(selectedDate).toDate() : dayjs().toDate()
      );

      let indicator = document.querySelector(
        ".rbc-current-time"
      ) as HTMLElement;

      if (!isSameDate) {
        if (indicator) wrapper?.removeChild(indicator);
        return;
      }

      if (!indicator) {
        indicator = document.createElement("div");
        indicator.className = "rbc-current-time";
        indicator.style.position = "absolute";
        indicator.style.left = "-54px";
        indicator.style.boxSizing = "content-box";
        indicator.style.width = "48px";
        indicator.style.height = "22px";
        indicator.style.color = "#2E90FA";
        indicator.style.border = "1px solid #2E90FA";
        indicator.style.fontSize = "14px";
        indicator.style.textAlign = "center";
        indicator.style.fontWeight = "500";
        indicator.style.background = "white";
        indicator.style.borderRadius = "8px";
        indicator.style.transform = "translateY(-36%)";
        indicator.style.top = `${calcTop(content).persontage}%`;
        indicator.innerText = content;

        if (wrapper) {
          wrapper.appendChild(indicator.cloneNode(true));
        }
      } else {
        indicator.style.top = `${calcTop(content).persontage}%`;
        indicator.innerText = content;
      }
    };

    updateIndicator();

    const interval = setInterval(updateIndicator, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDate, isMobile, selectectedResource, calcTop]);

  const handleChangeServices = (value: string[]) => {
    const selected = value.map(
      (val) => servicesData.find((service) => service.time === val)!
    );
    setSelectedServices(selected);
  };

  const handleChangeResource = (value: string) => {
    setSelectedResource(+value);
  };

  const handleSelectEvent = useCallback((event: IEvent) => {
    setChooseEvent(event);
  }, []);

  const { defaultDate, formats } = useMemo(
    () => ({
      defaultDate: dayjs().toDate(),
      formats: {
        timeGutterFormat: (date: any, culture: any, localizer: any) =>
          localizer.format(date, "HH:mm", culture),
      },
    }),
    []
  );

  useEffect(() => {
    if (isMobile) {
      setSelectedResource(resourceMap[0].resourceId);
    }
  }, [isMobile]);

  const calcResource = useMemo(() => {
    if (isMobile) {
      const findResource = resource.find(
        (res) => res.resourceId === selectectedResource
      );

      if (!findResource) return [];

      return [findResource];
    }
    return resource;
  }, [isMobile, selectectedResource, resource]);

  const [view, setView] = useState<View>("day");
  const onView = useCallback((newView: View) => setView(newView), [setView]);

  const handleCreateEvent = () => {
    if (!event) {
      messageApi.open({
        type: "warning",
        content:
          "Please enter complete information such as name, phone number, date and time, service and staff",
      });
      return;
      return;
    }
    setEvents((pre) => [...pre, event]);
    handleClear();
  };

  const onNavigate = useCallback(
    (newDate: Date) => setSelectedDate(newDate.toLocaleDateString()),
    [setSelectedDate]
  );

  const resourceHeader = useCallback(
    (resourceId: number, label: string, avatar?: string) => {
      return (
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            gap: 12,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedResource((pre) =>
              pre === resourceId ? null : resourceId
            );
          }}
        >
          {resource[0].resourceId === resourceId ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                const totalPage = Math.ceil(resourceMap.length / skip);
                handleClear();
                setPage((pre) => (pre - 1 < 1 ? totalPage : pre - 1));
              }}
              className="absolute top-1/2 left-[-6%] -translate-y-1/2 transition-all hover:-translate-x-[2px] hover:opacity-85 w-[40px] h-[40px]"
            >
              <img
                src={slidePreviousIcon}
                alt={slidePreviousIcon}
                width={40}
                height={40}
                className="rounded-full w-full h-full"
              />
            </div>
          ) : null}

          {resource[resource.length - 1].resourceId === resourceId ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                const totalPage = Math.ceil(resourceMap.length / skip);
                handleClear();
                setPage((pre) => (pre + 1 > totalPage ? 1 : pre + 1));
              }}
              className="absolute top-1/2 right-[0%] -translate-y-1/2 transition-all hover:translate-x-[2px] hover:opacity-85 w-[40px] h-[40px]"
            >
              <img
                src={slideNextIcon}
                alt={slideNextIcon}
                width={40}
                height={40}
                className="rounded-full w-full h-full"
              />
            </div>
          ) : null}
          <img
            src={avatar ? avatar : avatarIcon}
            alt={avatar ? avatar : avatarIcon}
            className="rounded-full w-12 h-12"
          />
          <div>
            <h3 className="text-[#101828] text-[18px] leading-5 font-medium line-clamp-1 break-all">
              {label}
            </h3>
            <div className="border border-[#ABEFC6] w-[69px] h-[22px] rounded-full grid place-items-center">
              <span className="text-[#067647] text-[12px] leading-[18px] font-medium">
                Senior
              </span>
            </div>
          </div>
        </div>
      );
    },
    [resource, skip, handleClear]
  );

  const eventCustom = useCallback(
    (p: EventProps<IEvent>) => {
      const services: IService[] = p.event.data.services;
      const startTime = formatTime(p.event.start);
      const endTime = formatTime(p.event.end);
      const specificTime = dayjs(p.event.start);
      const currentTime = dayjs();

      const isVisibleBlock = currentTime.isAfter(specificTime);
      const isEventamp = event?.id === p.event.id;

      return !isVisibleBlock ? (
        <CustomEventComponent
          event={p.event}
          isEventamp={isEventamp}
          startTime={startTime}
          endTime={endTime}
          services={services}
          chooseEvent={chooseEvent}
          setChooseEvent={setChooseEvent}
          myEvents={myEvents}
          setEvents={setEvents}
          popupRef={popupRef}
        />
      ) : (
        <EventBlocked />
      );
    },
    [myEvents, chooseEvent, event]
  );

  const hasClass = (element: Node | null, className: string): boolean => {
    while (element) {
      if (
        (element as HTMLElement).classList &&
        (element as HTMLElement).classList.contains(className)
      ) {
        return true;
      }
      element = element.parentNode as Node;
    }
    return false;
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!chooseEvent) return;

      if (!hasClass(e.target as Node, "eventCustom")) {
        setChooseEvent(null);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [chooseEvent]);

  useEffect(() => {
    const containerScroll = document.querySelector(".rbc-time-content");

    if (!popupRef.current || !containerScroll) return;

    const containerRect = containerScroll.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const elements = document.querySelectorAll(".rbc-day-slot.rbc-time-column");

    if (popupRect.left < containerRect.left) {
      popupRef.current.style.right = "-80%";

      elements.forEach((element, indexc) => {
        const zIndex = 15;
        (element as HTMLElement).style.zIndex = `${zIndex - indexc}`;
      });
    } else {
      elements.forEach((element, indexc) => {
        const zIndex = 12;
        (element as HTMLElement).style.zIndex = `${zIndex + indexc}`;
      });
    }
  }, [chooseEvent]);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col h-full overflow-hidden">
        <Heading />
        <Summary />
        <Controller
          service={{
            value: selectedService.map((service) => service.time),
            options: servicesData.map((service) => ({
              label: service.name,
              value: service.time,
            })),
            onChange: handleChangeServices,
          }}
          resource={{
            value: selectectedResource,
            options: resource.map((resource) => ({
              label: resource.resourceTitle,
              value: `${resource.resourceId}`,
            })),
            onChange: handleChangeResource,
          }}
          input={{
            userName: {
              value: inputUserName,
              onChange: (value: string) => setInputUserName(value),
            },
            phone: {
              value: inputPhone,
              onChange: (value: string) => setInputPhone(value),
            },
          }}
          dateTime={{
            valueDate: selectedDate
              ? dayjs(selectedDate).toDate()
              : dayjs().toDate(),
            onChangeDate: (date: string) => {
              setSelectedDate(date);
            },
            valueTime: time ? time : null,
            onChangeTime: (time: string) => {
              setSelectedTime(time);
            },
          }}
          handleCreateEvent={handleCreateEvent}
          handleClear={handleClear}
        />

        <div
          ref={wrapperCalendarRef}
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            overflow: "hidden",
            paddingBottom: 10,
          }}
        >
          <Calendar
            localizer={localizer}
            onView={onView}
            view={view}
            date={
              selectedDate ? dayjs(selectedDate).toDate() : dayjs().toDate()
            }
            allDayMaxRows={4}
            scrollToTime={
              !dayjs(selectedDate).isSame(dayjs(), "day")
                ? new Date(selectedDate)
                : new Date()
            }
            toolbar={false}
            formats={formats}
            slotPropGetter={(_, resourceId) => {
              return {
                style: {
                  height: 80,
                  backgroundColor:
                    resourceId === selectectedResource ? "#F2F4F7" : "unset",
                },
              };
            }}
            onNavigate={onNavigate}
            components={{
              timeGutterWrapper: (pre: any) => {
                const children: JSX.Element = pre.children;
                return React.cloneElement(
                  children,
                  { style: { possition: "relative" } },
                  <>
                    {pre.children}
                    {time ? (
                      <div
                        id="rbc-current-time-from-12"
                        style={{
                          position: "absolute",
                          left: "6px",
                          zIndex: 10,
                          boxSizing: "content-box",
                          width: "48px",
                          height: "22px",
                          color: "#EF6820",
                          border: "1px solid #EF6820",
                          fontSize: "14px",
                          textAlign: "center",
                          fontWeight: "500",
                          background: "white",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                          top: `${calcTop(time).persontage}%`,
                          transform: "translateY(-50%)",
                        }}
                      >
                        <div style={{ color: "#EF6820", fontWeight: 600 }}>
                          {time}
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              },
              event: eventCustom,
              resourceHeader: (prop) =>
                resourceHeader(
                  prop.resource.resourceId,
                  prop.label as string,
                  prop.resource.data.avatar
                ),
            }}
            defaultDate={defaultDate}
            resourceIdAccessor="resourceId"
            resources={calcResource}
            resourceTitleAccessor="resourceTitle"
            events={event ? myEvents.concat([event]) : myEvents}
            // startAccessor="start"
            // endAccessor="end"
            style={{ height: "100%" }}
            // step={15}
            // timeslots={2}
            selected={true}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>
    </>
  );
};
export default MyCalendar;
