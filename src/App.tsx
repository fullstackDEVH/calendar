import {
  Calendar,
  DayPropGetter,
  SlotInfo,
  View,
  dayjsLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

const localizer = dayjsLocalizer(dayjs);

const resourceMap = [
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

const now = dayjs();

interface IEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId: number | number[];
}

const events: IEvent[] = [
  {
    id: 0,
    title: "Board meeting",
    start: new Date(now.year(), now.month(), now.date(), 9, 0, 0),
    end: new Date(now.year(), now.month(), now.date(), 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: "MS training",
    start: new Date(now.year(), now.month(), now.date(), 14, 0, 0),
    end: new Date(now.year(), now.month(), now.date(), 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: "Team lead meeting",
    start: new Date(now.year(), now.month(), now.date(), 8, 30, 0),
    end: new Date(now.year(), now.month(), now.date(), 12, 30, 0),
    resourceId: [2, 3],
  },
  {
    id: 11,
    title: "Birthday Party",
    start: new Date(
      now.add(1, "day").year(),
      now.add(1, "day").month(),
      now.add(1, "day").date(),
      7,
      0,
      0
    ),
    end: new Date(
      now.add(1, "day").year(),
      now.add(1, "day").month(),
      now.add(1, "day").date(),
      10,
      30,
      0
    ),
    resourceId: 4,
  },
];

const MyCalendar = () => {
  const [value, onChange] = useState<string>("");

  const [myEvents, setEvents] = useState(events);
  const [selectectedResource, setSelectedResource] = useState<number | null>(
    null
  );
  const [time, setTime] = useState<string>("");

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
        };
        setEvents((prev) => [...prev, event]);
      }
    },
    [setEvents]
  );
  const [state, setState] = useState(false);
  const handleSelectEvent = useCallback(
    (event: IEvent) => window.alert(event.title),
    []
  );

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: dayjs().toDate(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const [view, setView] = useState<View>("day");
  const onView = useCallback((newView: View) => setView(newView), [setView]);

  const dayPropGetter = useCallback((date, resourceId) => {
    console.log(resourceId);
    // ({
    //   ...(moment(date).day() === 2 && {
    //     className: 'tuesday',
    //   }),
    // })
    return {};
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const calcTop = () => {
    const startOfDay = dayjs().startOf("day");
    const selectedDayjs = dayjs(`${dayjs().format("YYYY-MM-DD")}T${time}`);
    const diffMinutes = selectedDayjs.diff(startOfDay, "minute");

    let newTotal;
    if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      newTotal = hours * 40 + (remainingMinutes / 60) * 40;
    } else {
      newTotal = (diffMinutes / 60) * 40;
    }
    return (newTotal / 960) * 100;
  };

  return (
    <div>
      <input
        type="date"
        name=""
        id=""
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input type="time" value={time} onChange={handleTimeChange} />
      <div style={{ width: "100%", height: "100%" }}>
        <Calendar
          localizer={localizer}
          onView={onView}
          view={view}
          date={value ? dayjs(value).toDate() : dayjs().toDate()}
          allDayMaxRows={4}
          // dayPropGetter={dayPropGetter}
          slotPropGetter={(date, resourceId) => {
            return {
              style: {
                backgroundColor:
                  resourceId === selectectedResource ? "pink" : "unset",
                border:
                  dayjs(date).toDate() === dayjs().toDate()
                    ? "1px solid red"
                    : "",
              },
            };
          }}
          components={{
            event: (p) => {
              // console.log(p);

              return null;
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
            dayColumnWrapper: (re: any) => {
              const data: (boolean | object | [])[] = re.children;
              const currentResource = re.resource;

              return (
                <div
                  key={currentResource}
                  className={re.className}
                  style={{
                    background:
                      currentResource === selectectedResource ? "pink" : "",
                  }}
                >
                  {time ? (
                    <div
                      id="rbc-current-time-from"
                      style={{
                        position: "absolute",
                        zIndex: 4,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: "red",
                        top: `${calcTop()}%`,
                      }}
                    ></div>
                  ) : null}
                  {data.map((item, index) => {
                    if (Array.isArray(item)) {
                      return (
                        <>
                          {item.map((subItem, ind) => {
                            if (
                              typeof item === "object" &&
                              React.isValidElement(subItem)
                            ) {
                              return React.cloneElement(subItem, { key: ind });
                            }
                            return null;
                          })}
                        </>
                      );
                    } else if (
                      typeof item === "object" &&
                      React.isValidElement(item)
                    ) {
                      return React.cloneElement(item, { key: index });
                    }
                    return null;
                  })}
                </div>
              );
            },
          }}
          /**
           * rbc-day-slot rbc-time-column rbc-now rbc-today
           *        - rbc-timeslot-group
           *               - rbc-time-slot
           */
          defaultDate={defaultDate}
          resourceIdAccessor="resourceId"
          resources={resourceMap}
          resourceTitleAccessor="resourceTitle"
          events={myEvents}
          // startAccessor="start"
          // endAccessor="end"
          style={{ height: "100%" }}
          // step={15}
          // timeslots={2}
          // scrollToTime={scrollToTime}
          selected={true}
          onSelectEvent={handleSelectEvent}
          // onSelectSlot={handleSelectSlot}
        />
      </div>
    </div>
  );
};
export default MyCalendar;
