import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import Hole from '../hole/hole';
import './shape.scss';

function Shape({ id, details, onDrag }, ref) {
  const [{ isDragging }, dragElement] = useDrag(() => ({
    type: "shape",
    item: {id: id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }));

  useEffect(() => {
    onDrag(id);
  }, [isDragging])

  const row = details['row'];
  const column = details['column'];
  const matrix = details['matrix'];
  const rotate = details['rotate'];

  const divStyle = {
    gridTemplateColumns: `repeat(${ column }, 1fr)`,
    gridTemplateRows: `repeat(${ row }, 1fr)`
  }

  return (
    <div ref={ dragElement }>
      <div ref={ ref } className='shape-wrapper' style={ divStyle }>
        {
          [...Array(row).keys()].map((i) => {
            return (
              <>
                {
                  [...Array(column).keys()].map((j) => {
                    return <Hole key={ "" + i + j }
                            className={ `${
                              matrix[i][j] == 1
                                ? 'filled-hole'
                                : 'empty-hole' }` } />
                  })
                }
              </>
            )
          })
        }
      </div>
    </div>
  );
}

export default React.forwardRef(Shape);