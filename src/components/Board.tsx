import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const API_URL = "http://localhost:5000"; // ✅ Backend URL

const Board: React.FC = () => {
  const [columns, setColumns] = useState<{ id: number; name: string }[]>([]);
  const [tasks, setTasks] = useState<{ id: number; title: string; column_id: number }[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("darkMode") || "false");
  });//🌙 Dark Mode Toggle

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  
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

  // ✅ Delete Column
  const deleteColumn = async (id: number) => {
    const response = await fetch(`${API_URL}/columns/${id}`, { method: "DELETE" });
    if (response.ok) {
      setColumns(prev => prev.filter(col => col.id !== id));
      setTasks(prev => prev.filter(task => task.column_id !== id));
    }
  };

  // ✅ Edit Column Name
  const editColumn = async (columnId: number) => {
    const newName = prompt("Edit column name:");
    if (!newName) return;

    setColumns(prev =>
      prev.map(col => (col.id === columnId ? { ...col, name: newName } : col))
    );

    await fetch(`${API_URL}/columns/${columnId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newName }),
    });
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

  // ✅ Delete Task
  const deleteTask = async (id: number) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    if (response.ok) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  // ✅ Edit Task Name
const editTask = async (taskId: number) => {
  const newTitle = prompt("Edit task name:");
  if (!newTitle) return;

  setTasks(prev =>
    prev.map(task => (task.id === taskId ? { ...task, title: newTitle } : task))
  );

  await fetch(`${API_URL}/tasks/${taskId}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newTitle }),
  });
};


  // 🌙 Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      localStorage.setItem("darkMode", JSON.stringify(!prevMode)); // ✅ Save setting
      return !prevMode;
    });
  };
  

  return (
    <div className={`p-5 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      
      {/* 🌙 Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-4 right-4 px-3 py-1 rounded bg-gray-700 text-white shadow-md">
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <button className="bg-green-500 text-white px-3 py-1 rounded mb-3 shadow-md hover:bg-green-600 transition" onClick={addColumn}>
        + Add Column
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* ✅ Grid for columns with max 4 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id.toString()}>
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps} 
                  className={`p-4 rounded shadow min-w-[250px] transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  {/* ✅ Column Header with Editable Name */}
                  <h2 className="font-bold flex justify-between items-center">
                    <span 
                      onClick={() => editColumn(column.id)} 
                      className="cursor-pointer hover:underline">
                      {column.name}
                    </span>
                    <button className="text-white bg-red-500 px-2 rounded hover:bg-red-600 transition" onClick={() => deleteColumn(column.id)}>
                      ✖
                    </button>
                  </h2>

                  {/* ✅ Render Tasks */}
                  {tasks
                    .filter(task => task.column_id === column.id)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-blue-500 text-white p-2 rounded mt-2 flex justify-between shadow-md transition-transform duration-200 hover:scale-105"
                          >
                            <span 
                              onClick={() => editTask(task.id)} 
                              className="cursor-pointer hover:underline">
                              {task.title}
                            </span>
                            <button className="text-white bg-red-500 px-2 ml-2 rounded hover:bg-red-600 transition" onClick={() => deleteTask(task.id)}>
                              ✖
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}

                  {/* ✅ Add Task Button */}
                  <button className="bg-green-500 text-white px-2 mt-2 rounded w-full shadow-md hover:bg-green-600 transition" onClick={() => addTask(column.id)}>
                    + Add Task
                  </button>
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
