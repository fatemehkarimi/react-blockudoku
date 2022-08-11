import React from 'react';
import { useDragLayer } from 'react-dnd';
import ShapeDragPreview from './shapeDragPreview';

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0
}

function getItemStyles(initialOffset, currentOffset) {
  if(!initialOffset || !currentOffset)
    return {
      "display": "none"
    };

  var {x, y} = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

function ShapeDragLayer(props) {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset
  } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset()
  }))

  if(!isDragging)
    return null;
  
  return(
    <div style={ layerStyles }>
      <div style={ getItemStyles(initialOffset, currentOffset) }>
        <ShapeDragPreview details={ props.details }/>        
      </div>
    </div>
  )
}

export default ShapeDragLayer;