import React, { useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

const Calender = () => {

    const [events, setEvents] = useState([]);
    const [viewMode, setViewMode] = useState("calendar");
    const [eventModal, setEventModal] = useState(null);
    const [img, setImg] = useState(null);
    const [calendarView, setCalendarView] = useState("dayGridMonth"); 

    const handleDateClick = (info) => {
        const newEvent = {
          id: String(new Date().getTime()),
          title: "New Event",
          start: info.dateStr,
          end: info.dateStr,
          color: "#3788d8",
          image: null,
        };
        setEventModal(newEvent); 
      };

      const handleEventClick = (clickInfo) => {
        setEventModal({
          ...clickInfo.event,
          title: clickInfo.event.title,
          start: clickInfo.event.startStr,
          end: clickInfo.event.endStr,
          color: clickInfo.event.backgroundColor,
          image: clickInfo.event.extendedProps?.image || null, 
        });
      };

      const saveEvent = (updatedEvent) => {
        setEvents((prev) => {
          const eventExists = prev.find((e) => e.id === updatedEvent.id);
      
          if (eventExists) {
            return prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
          } else {
            return [...prev, updatedEvent];
          }
        });
      
        setEventModal(null); 
      };
    
      const deleteEvent = (eventId) => {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        setEventModal(null);
      };

  return (
    <>
        <div className="flex justify-between items-center mb-4">
        {/* <h1 className="text-2xl font-bold">Google Calendar Clone</h1> */}
        <button  className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setViewMode(viewMode === "calendar" ? "table" : "calendar")}>
          Toggle to {viewMode === "calendar" ? "Table" : "Calendar"} View
        </button>
      </div>

      

      {viewMode === "calendar" ? (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={calendarView}
          editable={true}
          selectable={true}
          events={events.map((event)=>({
            ...event,
            extendedProps: { image: event.image },
          }))}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="table text-center w-full border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Start</th>
                <th>End</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td><img src={typeof event.image === "string" ? event.image : URL.createObjectURL(event.image)} className="w-16 h-16 object-cover mx-10"/></td>
                  <td>{event.start}</td>
                  <td>{event.end}</td>
                  <td>
                    <span
                      className="inline-block w-4 h-4 rounded"
                      style={{ backgroundColor: event.color }}
                    ></span>
                  </td>
                  <td>
                    <button className="text-blue-500 hover:text-white bg-white hover:bg-blue-500 border border-blue-500 px-4 py-2 rounded transition duration-300"     
                    onClick={() => setEventModal(event)}>
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-white bg-white hover:bg-blue-500 border border-blue-500 px-4 py-2 rounded transition duration-300"
                      onClick={() => deleteEvent(event.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{eventModal && (
  <div
    className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
    onClick={() => setEventModal(null)}>
    <div className="bg-white p-6 rounded shadow"  onClick={(e) => e.stopPropagation()}>
      <h2 className="text-lg font-bold mb-4">
        {eventModal.id ? "Edit Event" : "Add Event"}
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={eventModal.title}
          onChange={(e) =>
            setEventModal({ ...eventModal, title: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
            type="file"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files[0];
                setEventModal({ ...eventModal, image: file }); 
            }}
            className="w-full border p-2 rounded"
            />
        <input
          type="datetime-local"
          value={eventModal.start}
          onChange={(e) =>
            setEventModal({ ...eventModal, start: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={eventModal.end}
          onChange={(e) =>
            setEventModal({ ...eventModal, end: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="color"
          value={eventModal.color}
          onChange={(e) =>
            setEventModal({ ...eventModal, color: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex justify-end mt-4">
        <button className="bg-gray-300 px-4 py-2 rounded mr-2"  onClick={() => setEventModal(null)}>  Cancel  </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded"  onClick={() => saveEvent(eventModal)}>  Save </button>
      </div>
    </div>
  </div>
)}
    </>
  )
}

export default Calender