// DroppableSeat.jsx
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function DraggableStudentSeat({ student, seatId, onClick }) {
  const dragStartPos = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student-seat',
    item: { studentId: student.id, seatId },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      onMouseDown={(e) => { dragStartPos.current = { x: e.clientX, y: e.clientY }; }}
      onClick={(e) => {
        if (dragStartPos.current) {
          const moved = Math.abs(e.clientX - dragStartPos.current.x) > 5 || Math.abs(e.clientY - dragStartPos.current.y) > 5;
          if (!moved && !isDragging && onClick) onClick();
          dragStartPos.current = null;
        }
      }}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''} flex flex-col items-center`}
    >
      <Avatar className="w-12 h-12 border-2 border-primary">
        <AvatarImage src={student.avatar} alt={student.name} />
        <AvatarFallback>{student.name?.charAt(0) ?? '؟'}</AvatarFallback>
      </Avatar>
      <p className="text-xs mt-1 text-center truncate max-w-[60px]">{student.name?.split(' ')[0]}</p>
    </div>
  );
}

export default function DroppableSeat({ seat, onDrop, onStudentClick }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'student-seat',
    drop: (item) => { if (item.seatId !== seat.id) onDrop(item.studentId, item.seatId, seat.id); },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center ${isOver ? 'border-primary bg-primary/10' : 'border-border'} ${seat.student ? 'bg-card' : 'bg-muted/30'}`}
    >
      {seat.student ? (
        <DraggableStudentSeat student={seat.student} seatId={seat.id} onClick={() => onStudentClick && onStudentClick(seat.student)} />
      ) : (
        <div className="text-xs text-muted-foreground text-center">فارغ</div>
      )}
    </div>
  );
}
