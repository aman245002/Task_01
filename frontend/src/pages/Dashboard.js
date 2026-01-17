import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
    const [columns, setColumns] = useState({
        pending: { name: 'Pending', items: [] },
        'in-progress': { name: 'In Progress', items: [] },
        completed: { name: 'Completed', items: [] }
    });
    const navigate = useNavigate();

    // Helper: Get Token
    const getAuthHeader = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    // 1. Fetch Tasks (Wrapped in useCallback to fix warning)
    const fetchTasks = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/tasks', getAuthHeader());
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response?.status === 401) navigate('/login');
        }
    }, [navigate]);

    // Initial Load
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // 2. Sort Tasks into Columns
    useEffect(() => {
        setColumns({
            pending: { name: 'Pending', items: tasks.filter(t => t.status === 'pending') },
            'in-progress': { name: 'In Progress', items: tasks.filter(t => t.status === 'in-progress') },
            completed: { name: 'Completed', items: tasks.filter(t => t.status === 'completed') }
        });
    }, [tasks]);

    // 3. Handle Create Task
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tasks', newTask, getAuthHeader());
            setNewTask({ title: '', description: '', due_date: '' }); // Reset form
            fetchTasks(); // Refresh board
        } catch (error) {
            alert('Error creating task');
        }
    };

    // 4. Handle Drag & Drop
    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            // Optimistic Update
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

            // API Call
            await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, { status: destination.droppableId }, getAuthHeader());
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', background: '#f4f5f7' }}>
            
            {/* --- HEADER SECTION (Profile & Logout) --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>Task Board</h1>
                <div>
                    <button 
                        onClick={() => navigate('/profile')} 
                        style={{ padding: '8px 16px', marginRight: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Profile
                    </button>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            navigate('/login');
                        }} 
                        style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Add Task Form */}
            <div style={{ marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Create New Task</h3>
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                        placeholder="Task Title" 
                        value={newTask.title} 
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                        required 
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input 
                        placeholder="Description" 
                        value={newTask.description} 
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flexGrow: 1 }}
                    />
                    <input 
                        type="date" 
                        value={newTask.due_date} 
                        onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} 
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px', background: '#0079bf', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Add Task
                    </button>
                </form>
            </div>

            {/* Kanban Board */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', marginBottom: '10px', textTransform: 'capitalize' }}>{column.name}</h2>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            background: snapshot.isDraggingOver ? '#e6fcff' : '#ebecf0',
                                            padding: '8px',
                                            width: '280px',
                                            minHeight: '500px',
                                            borderRadius: '5px'
                                        }}
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