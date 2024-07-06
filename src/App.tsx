import { Calendar, View, dayjsLocalizer } from "react-big-calendar";
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
  { name: "Service 1", time: "30 min" },
  { name: "Service 2", time: "15 min" },
  { name: "Service 3", time: "20 min" },
  { name: "Service 4", time: "60 min" },
  { name: "Service 5", time: "45 min" },
  { name: "Service 6", time: "90 min" },
];

const resourceMap: IResource[] = [
  {
    resourceId: 1,
    resourceTitle: "Board room",
    data: { name: "name", avatar: "avatar" },
  },
  {
    resourceId: 2,
    resourceTitle: "Training room",
    data: { name: "name", avatar: "avatar" },
  },
  {
    resourceId: 3,
    resourceTitle: "Meeting room 1",
    data: { name: "name", avatar: "avatar" },
  },
  {
    resourceId: 4,
    resourceTitle: "Meeting room 2",
    data: { name: "name", avatar: "avatar" },
  },
];

interface IEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId: number | number[];
  data: IService[];
}

const MyCalendar = () => {
  const [date, onChange] = useState<string>("");

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

  const [resource] = useState<IResource[]>(resourceMap);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [selectectedResource, setSelectedResource] = useState<number | null>(
    null
  );
  const [time, setTime] = useState<string>("");
  const [selectedService, setSelectedServices] = useState<string[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    new Date()
  );
  const elementRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("myEvents", JSON.stringify(myEvents));
  }, [myEvents]);

  useEffect(() => {
    if (!date || !time || !selectectedResource || selectedService.length < 1)
      return;

    const startDay = dayjs(`${date}T${time}`).toDate();
    const totalMinutes = selectedService.reduce((acc, time) => {
      const minutes = parseInt(time.split(" ")[0], 10);
      return acc + minutes;
    }, 0);
    const endDay = dayjs(startDay).add(totalMinutes, "minute").toDate();

    setEvent({
      id: Math.floor(Math.random() * 10001),
      title: "title",
      start: startDay,
      end: endDay,
      resourceId: selectectedResource,
      data: selectedService.map((service) => ({
        name: service,
        time: service,
      })),
    });
  }, [date, time, selectectedResource, selectedService]);

  const handleClear = useCallback(() => {
    setEvent(null);
    setTime("");
    setSelectedServices([]);
    if (!isMobile) setSelectedResource(null);
  }, [isMobile]);

  useEffect(() => {
    if (date) {
      handleClear();
    }
  }, [date, handleClear]);

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
      newDiv.style.height = "1px";
      newDiv.style.background = "green";
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
    const element = elementRef.current;
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
        date ? dayjs(date).toDate() : dayjs().toDate()
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
        indicator.style.left = "-38px";
        indicator.style.width = "38px";
        indicator.style.height = "20px";
        indicator.style.color = "red";
        indicator.style.border = "1px solid red";
        indicator.style.fontSize = "14px";
        indicator.style.textAlign = "center";
        indicator.style.fontWeight = "600";
        indicator.style.background = "white";
        indicator.style.borderRadius = "12px";
        indicator.style.transform = "translateY(-50%)";
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
  }, [date, isMobile, selectectedResource, calcTop]);

  const handleChangeServices = (value: string[]) => {
    setSelectedServices(value);
  };

  const handleChangeResource = (value: string) => {
    setSelectedResource(+value);
  };

  const handleSelectEvent = useCallback((event: IEvent) => {
    setChooseEvent(event);
  }, []);

  const { defaultDate, scrollToTime, formats } = useMemo(
    () => ({
      defaultDate: dayjs().toDate(),
      scrollToTime: dayjs().toDate(),
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

  useEffect(() => {
    window.addEventListener("appinstalled", () => {
      console.log("INSTALL: Success");
    });
  }, []);

  const [view, setView] = useState<View>("day");
  const onView = useCallback((newView: View) => setView(newView), [setView]);

  // const dayPropGetter = useCallback((date, resourceId) => {
  //   // console.log(resourceId);
  //   // ({
  //   //   ...(moment(date).day() === 2 && {
  //   //     className: 'tuesday',
  //   //   }),
  //   // })
  //   return {};
  // }, []);

  const handleCreateEvent = () => {
    if (!event) return;
    setEvents((pre) => [...pre, event]);
    handleClear();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Heading />
      <Summary />
      <Controller
        service={{
          value: selectedService,
          options: servicesData.map((service) => ({
            label: service.name,
            value: service.time,
          })),
          onChange: handleChangeServices,
        }}
        resource={{
          value: selectectedResource,
          options: resourceMap.map((resource) => ({
            label: resource.resourceTitle,
            value: `${resource.resourceId}`,
          })),
          onChange: handleChangeResource,
        }}
        dateTime={{
          value: selectedDateTime,
          onChange: (value) => setSelectedDateTime(value),
        }}
        handleCreateEvent={handleCreateEvent}
        handleClear={handleClear}
      />

      <div
        ref={elementRef}
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
          date={date ? dayjs(date).toDate() : dayjs().toDate()}
          allDayMaxRows={4}
          // dayPropGetter={dayPropGetter}
          scrollToTime={scrollToTime}
          toolbar={false}
          formats={formats}
          slotPropGetter={(_, resourceId) => {
            return {
              style: {
                height: 80,
                backgroundColor:
                  resourceId === selectectedResource ? "seashell" : "unset",
              },
            };
          }}
          components={{
            timeGutterHeader: () => {
              return date
                ? dayjs(`${date}`).format("dddd MMM DD")
                : dayjs().format("dddd MMM DD");
            },
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
                        zIndex: 10,
                        right: 0,
                        height: 20,
                        width: 40,
                        borderRadius: 8,
                        transform: "translateY(-50%)",
                        border: "1px solid green",
                        top: `${calcTop(time).persontage}%`,
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div style={{ color: "green", fontWeight: 600 }}>
                        {time}
                      </div>
                    </div>
                  ) : null}
                </>
              );
            },
            event: (p) => {
              const services: IService[] = p.event.data;
              return (
                <div style={{ position: "relative" }}>
                  {services.map((service, index) => (
                    <div key={index}>{service.name}</div>
                  ))}
                  {chooseEvent?.id === p.event.id &&
                  myEvents.find((event) => event.id === chooseEvent?.id) ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "white",
                      }}
                    >
                      <div
                        className=""
                        onClick={(e) => {
                          e.stopPropagation();
                          setEvents((pre) => {
                            const newEvents = pre.filter(
                              (event) => event.id !== chooseEvent?.id
                            );
                            return newEvents;
                          });
                        }}
                      >
                        <p style={{ color: "black", fontSize: "16" }}>
                          Delete Event
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            },
            // eventWrapper: (dataa : any) => {
            //   console.log(dataa);

            //   return 123
            // },
            resourceHeader: (prop) => {
              return (
                <div
                  style={{
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResource(prop.resource.resourceId);
                  }}
                >
                  {prop.label} - {prop.resource.data.name} -{" "}
                  {prop.resource.data.avatar}
                </div>
              );
            },
            // dayColumnWrapper: (re: any) => {
            //   const data: (boolean | object | [])[] = re.children;
            //   const currentResource = re.resource;
            //   console.log(re);

            //   return (
            //     <DayColumn
            //       ref={containerRef}
            //       key={currentResource}
            //       className={re.className}
            //       style={{
            //         background:
            //           currentResource === selectectedResource ? "pink" : "",
            //       }}
            //     >
            //       {time ? (
            // <div
            //   id="rbc-current-time-from"
            //   style={{
            //     position: "absolute",
            //     zIndex: 4,
            //     left: 0,
            //     right: 0,
            //     height: 1,
            //     background: "red",
            //     top: `${calcTop()}%`,
            //   }}
            // ></div>
            //       ) : null}
            //       {data.map((item, index) => {
            //         if (Array.isArray(item)) {
            //           return (
            //             <>
            //               {item.map((subItem, ind) => {
            //                 if (
            //                   typeof item === "object" &&
            //                   React.isValidElement(subItem)
            //                 ) {
            //                   return React.cloneElement(subItem, { key: ind });
            //                 }
            //                 return null;
            //               })}
            //             </>
            //           );
            //         } else if (
            //           typeof item === "object" &&
            //           React.isValidElement(item)
            //         ) {
            //           return React.cloneElement(item, { key: index });
            //         }
            //         return null;
            //       })}
            //     </DayColumn>
            //   );
            // },
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
          // scrollToTime={scrollToTime}
          selected={true}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
};
export default MyCalendar;
