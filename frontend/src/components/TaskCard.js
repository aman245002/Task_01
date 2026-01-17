import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index }) => {
    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        userSelect: 'none',
                        padding: '16px',
                        margin: '0 0 8px 0',
                        minHeight: '50px',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        ...provided.draggableProps.style
                    }}
                >
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{task.title}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                        {task.description}
                    </p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                        Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;