import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd';
import Shape from "./shape";


function DraggableShape({ id, details, onDrag }, ref) {
  const [{ isDragging }, dragElement] = useDrag(() => ({
    type: "shape",
    item: {id: id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }));

  useEffect(() => {
    if(isDragging)
      onDrag(id);
    else
      onDrag(null);
  }, [isDragging])

  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={ dragElement }>
      <Shape ref={ ref } details={ details } style={ { opacity } } />
    </div>
  );
}

export default React.forwardRef(DraggableShape);