import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the new Glassmorphism styles

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
    const [columns, setColumns] = useState({
        pending: { name: 'Pending', items: [] },
        'in-progress': { name: 'In Progress', items: [] },
        completed: { name: 'Completed', items: [] }
    });
    const navigate = useNavigate();

    const getAuthHeader = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    const fetchTasks = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/tasks', getAuthHeader());
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response?.status === 401) navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        setColumns({
            pending: { name: 'Pending', items: tasks.filter(t => t.status === 'pending') },
            'in-progress': { name: 'In Progress', items: tasks.filter(t => t.status === 'in-progress') },
            completed: { name: 'Completed', items: tasks.filter(t => t.status === 'completed') }
        });
    }, [tasks]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tasks', newTask, getAuthHeader());
            setNewTask({ title: '', description: '', due_date: '' });
            fetchTasks();
        } catch (error) {
            alert('Error creating task');
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            
            removed.status = destination.droppableId;
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems }
            });

            await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, { status: destination.droppableId }, getAuthHeader());
        }
    };

    return (
        <div className="dashboard-wrapper">
            
            {/* --- HEADER SECTION --- */}
            <div className="dashboard-header">
                <h1>Task Board</h1>
                <div>
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="btn-glass btn-profile"
                    >
                        Profile
                    </button>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            navigate('/login');
                        }} 
                        className="btn-glass btn-logout"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* --- ADD TASK FORM --- */}
            <div className="task-form-container">
                <h3>Create New Task</h3>
                <form onSubmit={handleAddTask} className="task-form">
                    <input 
                        className="task-input"
                        placeholder="Task Title" 
                        value={newTask.title} 
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                        required 
                    />
                    <input 
                        className="task-input"
                        placeholder="Description" 
                        value={newTask.description} 
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                    />
                    <input 
                        type="date" 
                        className="task-input"
                        value={newTask.due_date} 
                        onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} 
                    />
                    <button type="submit" className="btn-add">
                        + Add Task
                    </button>
                </form>
            </div>

            {/* --- KANBAN BOARD --- */}
            <div className="kanban-board">
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} className="kanban-column">
                            <h2>{column.name}</h2>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                    >
                                        {column.items.map((item, index) => (
                                            <TaskCard key={item._id} task={item} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
};

export default Dashboard;