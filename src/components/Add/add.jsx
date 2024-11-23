  import React, { useEffect, useState } from "react";
  import "./add.css";
  import axios from "axios";
  import Helmet from "react-helmet";

  export default function Add() {
    const [eventName, setEventName] = useState("");
    const [eventData, setEventData] = useState("");
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

  
    const fetchtodo = async () => {
      try {
        const response = await axios.get("todoback-production-de99.up.railway.app/api/eventdata");
        setEvents(response.data);
      } catch {
        console.log("Error fetching events");
      }
    };


    const addtodo = async () => {
      try {
       const response =  await axios.post("todoback-production-de99.up.railway.app/api/eventdata", {
          eventName,
          eventData,
        });
      
        setEvents(prevEvents => [...prevEvents, response.data]);
        setEventName("");
        setEventData("");
        
        console.log("Event added");
      } catch (error) {
        console.error("Error adding event:", error);
      }
    };

    
    const updatetodo = async (id, updatedName, updatedData) => {
      try {
        const response = await axios.put(`todoback-production-de99.up.railway.app/api/eventdata/${id}`, {
          eventName: updatedName,
          eventData: updatedData
        });
        
        // Update the events array with the updated todo
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event._id === id ? response.data : event
          )
        );
        
        // Reset edit mode
        setEditMode(false);
        setEditId(null);
        setEventName("");
        setEventData("");
        
        console.log("Event updated");
      } catch (error) {
        console.error("Error updating event:", error);
      }
    };

    const deletetodo = async () => {
      try {
        await axios.post("todoback-production-de99.up.railway.app/api/eventdata/delete", {
          ids: selectedEvents,
        });
  
        await fetchtodo();
        setSelectedEvents([]); 
        console.log("Selected events deleted");
      } catch {
        console.log("Error deleting events");
      }
    };
 
     


    const handleEvent = async (e) => {
      e.preventDefault();
      if (!eventName || !eventData) {
        window.alert("Please fill out both fields");
        return;
      }
      try {
        await addtodo();
        setEventName("");
        setEventData("");
        console.log("Event submitted:", { eventName, eventData });
      } catch {
        console.log("Error submitting event");
      }
    };




    const toggleEventSelection = (eventId) => {
      setSelectedEvents((prevSelected) =>
        prevSelected.includes(eventId)
          ? prevSelected.filter((id) => id !== eventId)
          : [...prevSelected, eventId]
      );
    };

    useEffect(() => {
      fetchtodo();
    
    }, []);

    return (
      <div className="add-container">
        <Helmet>
          <title>Todo</title>
        </Helmet>
        <h1 className="title">T O D O</h1>
        <div className="form-container">
          <form onSubmit={handleEvent} className="form">
            <h2>Add Event</h2>
            <label htmlFor="event-name" style={{ textAlign: "left" }}>
              Title:
            </label>
            <input
              type="text"
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
            />
            <label htmlFor="event-data" style={{ textAlign: "left" }}>
              Data:
            </label>
            <textarea
              id="event-data"
              value={eventData}
              onChange={(e) => setEventData(e.target.value)}
              placeholder="Enter event details"
              rows={5}
            ></textarea>
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  setEventName("");
                  setEventData("");
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <h2 className="list-title">Event List</h2>
        <ul className="event-list">
  {events.map((event) => (
    <li key={event._id} className="event-item">
      <input
        type="checkbox"
        checked={selectedEvents.includes(event._id)}
        onChange={() => toggleEventSelection(event._id)}
      />
      {editMode && editId === event._id ? (
        <div className="second-bar">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Update event name"
          />
          <textarea
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
            placeholder="Update event details"
          />
          <div className="form-button">
          <button
            onClick={() => updatetodo(event._id, eventName, eventData)}
            className="update-button"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setEventName("");
              setEventData("");
            }}
            className="cancel-button"
          >
            Cancel
          </button>
          </div>
        </div>
      ) : (
        <>
          <strong>{event.eventName}:</strong> {event.eventData}
          <button
            onClick={() => {
              setEditMode(true);
              setEditId(event._id);
              setEventName(event.eventName);
              setEventData(event.eventData);
            }}
            className="edit-button"
          >
            Edit
          </button>
        </>
      )}
    </li>
  ))}
</ul>
        {selectedEvents.length > 0 && (
          <button className="delete-button" onClick={deletetodo}>
            Delete Selected
          </button>
        )}
      </div>
    );
  }
