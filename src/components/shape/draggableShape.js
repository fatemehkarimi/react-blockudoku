import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Shape from "./shape";


function DraggableShape({ id, details, onDrag }, ref) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "shape",
    item: {id: id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }));

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true })
  }, []);

  useEffect(() => {
    if(isDragging)
      onDrag(id);
    else
      onDrag(null);
  }, [isDragging])

  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={ drag }>
      <Shape ref={ ref } details={ details } style={ { opacity } } />
    </div>
  );
}

export default React.forwardRef(DraggableShape);