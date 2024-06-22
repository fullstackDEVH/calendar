import { Calendar, SlotInfo, View, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const localizer = dayjsLocalizer(dayjs);

interface IService {
  name: string;
  time: string;
}

interface IResource {
  resourceId: number;
  resourceTitle: string;
  data: { name: string; avatar: string };
}

const servicesData: IService[] = [
  { name: "service 1", time: "30 min" },
  { name: "service 2", time: "15 min" },
  { name: "service 3", time: "20 min" },
  { name: "service 4", time: "60 min" },
  { name: "service 5", time: "30 min" },
  { name: "service 6", time: "90 min" },
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

  const [myEvents, setEvents] = useState<IEvent[]>([]);

  const [event, setEvent] = useState<IEvent | null>(null);
  const [chooseEvent, setChooseEvent] = useState<IEvent | null>(null);

  const [resource, setResource] = useState<IResource[]>([]);

  const [selectectedResource, setSelectedResource] = useState<number | null>(
    null
  );
  const [time, setTime] = useState<string>("");
  const [selectedService, setSelectedServices] = useState<string[]>([]);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!date || !time || !selectectedResource || selectedService.length < 1)
      return;

    const startDay = dayjs(`${dayjs().format("YYYY-MM-DD")}T${time}`).toDate();
    const totalMinutes = selectedService.reduce((acc, time) => {
      const minutes = parseInt(time.split(" ")[0], 10);
      return acc + minutes;
    }, 0);
    const endDay = dayjs(startDay).add(totalMinutes, "minute").toDate();

    setEvent({
      id: -9999,
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

  const calcTop = useCallback(() => {
    const startOfDay = dayjs().startOf("day");
    const selectedDayjs = dayjs(`${dayjs().format("YYYY-MM-DD")}T${time}`);
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
  }, [time]);

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
      const possitionTop = calcTop();

      container?.scrollTo({ top: possitionTop.distance, behavior: "smooth" });
      const newDiv = document.createElement("div");
      newDiv.id = "rbc-current-time-from";
      newDiv.style.position = "absolute";
      newDiv.style.zIndex = "4";
      newDiv.style.left = "0";
      newDiv.style.right = "0";
      newDiv.style.height = "1px";
      newDiv.style.background = "red";
      newDiv.style.top = `${possitionTop.persontage}%`;

      columns.forEach((column) => {
        column.appendChild(newDiv.cloneNode(true));
      });
    }
  }, [time, calcTop]);
  console.log(resource);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 700) {
          setResource([resourceMap[0]]);
        } else if (entry.contentRect.width < 1024) {
          setResource([resourceMap[0], resourceMap[1], resourceMap[2]]);
        } else setResource(resourceMap);
      }
    });

    resizeObserver.observe(element);

    // Cleanup
    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

  const handleChangeServices = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedServices((pre) => {
      let newData = [...pre];
      const find = pre.find((pre) => pre === event.target.value);

      if (find) {
        newData = newData.filter((data) => data !== find);
      } else {
        newData.push(event.target.value);
      }

      return newData;
    });
  };

  const handleSelectSlot = useCallback(
    (slot: SlotInfo) => {
      console.log(slot);
      const title = window.prompt("New Event name");

      if (title) {
        const event: IEvent = {
          start: slot.start,
          end: slot.end,
          title: title,
          resourceId: slot.resourceId as number,
          id: 10,
          data: [{ name: "services 1", time: "services 1" }],
        };
        setEvents((prev) => [...prev, event]);
      }
    },
    [setEvents]
  );

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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleCancel = () => {
    setEvent(null);
    setTime("");
    setSelectedServices([]);
    setSelectedResource(null);
  };

  const handleClick = () => {
    if (!event) return;
    setEvents((pre) => [...pre, event]);
    handleCancel();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexWrap:"wrap", gap: "20px", marginBottom: 30 }}>
        <input
          type="date"
          name=""
          id=""
          value={date}
          onChange={(e) => onChange(e.target.value)}
        />
        <input type="time" value={time} onChange={handleTimeChange} />

        <select
          value={`${selectectedResource}`}
          onChange={(e) => setSelectedResource(+e.target.value)}
        >
          {resourceMap.map((resource) => (
            <option value={resource.resourceId}>
              {resource.resourceTitle}
            </option>
          ))}
        </select>

        <select
          multiple={true}
          value={selectedService}
          onChange={handleChangeServices}
        >
          {servicesData.map((service) => (
            <option value={service.time}>{service.name}</option>
          ))}
        </select>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleClick}>Confirm</button>
      </div>
      <div
        ref={elementRef}
        style={{ width: "100%", height: "100%", flex: 1, overflow: "hidden" }}
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
                  resourceId === selectectedResource ? "pink" : "unset",
              },
            };
          }}
          components={{
            timeGutterHeader: () => {
              return dayjs(`${dayjs().format("YYYY-MM-DD")}T${time}`).format(
                "dddd MMM DD"
              );
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
                        border: "1px solid red",
                        top: `${calcTop().persontage}%`,
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div style={{ color: "red", fontWeight: 600 }}>
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
                  myEvents.find((event) => event.id === p.event.id) ? (
                    <div style={{ position: "absolute", top: 0, right: 0 }}>
                      <div
                        className=""
                        onClick={(e) => {
                          e.stopPropagation();
                          setEvents((pre) => {
                            const newEvents = pre.filter(
                              (event) => event.id !== p.event.id
                            );
                            return newEvents;
                          });
                        }}
                      >
                        Delete
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
          /**
           * rbc-day-slot rbc-time-column rbc-now rbc-today
           *        - rbc-timeslot-group
           *               - rbc-time-slot
           */
          defaultDate={defaultDate}
          resourceIdAccessor="resourceId"
          resources={resource}
          resourceTitleAccessor="resourceTitle"
          events={event ? myEvents.concat([event]) : myEvents}
          // startAccessor="start"
          // endAccessor="end"
          style={{ height: "100%" }}
          // step={15}
          // timeslots={2}
          // scrollToTime={scrollToTime}
          selected={true}
          selectable={true}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </div>
    </div>
  );
};
export default MyCalendar;
