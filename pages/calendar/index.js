import styled from "styled-components";
import { Calendar, globalizeLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import globalize from "globalize";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/router";
import StyledBackLink from "@/components/StyledBackLink";
import BackArrow from "@/public/assets/images/back-arrow.svg";

const localizer = globalizeLocalizer(globalize);
const DnDCalendar = withDragAndDrop(Calendar);

const StyledHeading = styled.h2`
  text-align: center;
  margin-bottom: 0.5rem;
`;

const StyledSection = styled.section`
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
  height: 530px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  box-shadow: 5px 5px 15px 5px rgba(112, 107, 91, 0.83);
`;

const StyledCalendar = styled(DnDCalendar)`
  height: 440px;
`;

export default function CalendarPage({
  tasks,
  onEditData,
  setDetailsBackLinkRef,
}) {
  const router = useRouter();

  const events = tasks.map((task) => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(12);
    dueDate.setMinutes(0);
    dueDate.setSeconds(0);
    return {
      id: task.id,
      title: task.title,
      start: new Date(dueDate),
      end: new Date(dueDate),
      allDay: true,
    };
  });

  function handleEventClick(task) {
    setDetailsBackLinkRef("/calendar");
    router.push(`/tasks/${task.id}`);
  }

  function onEventDrop(data) {
    const todayDate = new Date();
    const newTaskDate = data.start;
    console.log(newTaskDate, todayDate);

    if (newTaskDate < todayDate) return;

    const updatedTaskId = data.event.id;
    const taskToUpdate = tasks.find((task) => task.id === updatedTaskId);
    const updatedTask = {
      ...taskToUpdate,
      dueDate: data.start.toISOString().substring(0, 10),
    };
    onEditData(updatedTask);
  }

  const EventComponent = ({ event }) => (
    <div>
      <span>{event.title}</span>
    </div>
  );

  /* const WeekEvent = ({ event }) => (
    <div>
      <span>{event.title}</span>
    </div>
  );

  const MonthEvent = ({ event }) => (
    <div>
      <span>{event.title}</span>
    </div>
  ); */

  return (
    <StyledSection>
      <StyledBackLink href="/">
        <BackArrow />
      </StyledBackLink>
      <StyledHeading>My Calendar</StyledHeading>
      <StyledCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        onSelectEvent={handleEventClick}
        onEventDrop={onEventDrop}
        resizable={false}
        defaultView="month"
        views={["month", "week", "agenda"]}
        components={{
          event: EventComponent,
        }}
      />
    </StyledSection>
  );
}
