import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const API_URL = "http://localhost:5000"; // ✅ Backend URL

const Board: React.FC = () => {
  const [columns, setColumns] = useState<{ id: number; name: string }[]>([]);
  const [tasks, setTasks] = useState<{ id: number; title: string; column_id: number }[]>([]);

  // ✅ Fetch columns & tasks from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const columnsRes = await fetch(`${API_URL}/columns`);
        const tasksRes = await fetch(`${API_URL}/tasks`);
        const columnsData = await columnsRes.json();
        const tasksData = await tasksRes.json();

        setColumns(columnsData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Drag & Drop handler
  const onDragEnd = async ({ destination, draggableId }: DropResult) => {
    if (!destination) return;

    const movedTask = tasks.find(task => task.id.toString() === draggableId);
    if (!movedTask) return;

    setTasks(prev =>
      prev.map(task =>
        task.id === movedTask.id ? { ...task, column_id: Number(destination.droppableId) } : task
      )
    );

    await fetch(`${API_URL}/tasks/${movedTask.id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newColumnId: Number(destination.droppableId) }),
    });
};

  // ✅ Add a new column
  const addColumn = async () => {
    const name = prompt("Enter column name:");
    if (!name) return;

    const response = await fetch(`${API_URL}/columns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const newColumn = await response.json();
      setColumns(prev => [...prev, newColumn]);
    }
  };

  // ✅ Instant Delete Column (No Popup)
  const deleteColumn = async (id: number) => {
    const response = await fetch(`${API_URL}/columns/${id}`, { method: "DELETE" });
    if (response.ok) {
      setColumns(prev => prev.filter(col => col.id !== id));
      setTasks(prev => prev.filter(task => task.column_id !== id));
    }
  };

  // ✅ Add a new task
  const addTask = async (columnId: number) => {
    const title = prompt("Enter task name:");
    if (!title) return;

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, columnId }),
    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
    }
  };

  // ✅ Instant Delete Task (No Popup)
  const deleteTask = async (id: number) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    if (response.ok) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  return (
    <div className="p-5">
      <button className="bg-green-500 text-white px-3 py-1 rounded mb-3" onClick={addColumn}>
        + Add Column
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id.toString()}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-white p-4 rounded shadow w-1/3">
                  <h2 className="font-bold flex justify-between">
                    {column.name}
                    {/* ✅ White Cross Delete Icon for Columns */}
                    <button className="text-white bg-red-500 px-2 rounded" onClick={() => deleteColumn(column.id)}>
                      ✖
                    </button>
                  </h2>
                  {tasks.filter(task => task.column_id === column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          className="bg-blue-500 text-white p-2 rounded mt-2 flex justify-between">
                          {task.title}
                          {/* ✅ White Cross Delete Icon for Tasks */}
                          <button className="text-white bg-red-500 px-2 ml-2 rounded" onClick={() => deleteTask(task.id)}>
                            ✖
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button className="bg-green-500 text-white px-2 mt-2 rounded w-full" onClick={() => addTask(column.id)}>+ Add Task</button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
