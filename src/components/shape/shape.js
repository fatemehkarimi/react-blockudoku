import React from 'react';
import Hole from '../hole/hole';
import './shape.scss';

function Shape(props, ref) {
  const details = props.details;
  const row = details['row'];
  const column = details['column'];
  const matrix = details['matrix'];
  const rotate = details['rotate'];

  const gridStyle = {
    gridTemplateColumns: `repeat(${ column }, 1fr)`,
    gridTemplateRows: `repeat(${ row }, 1fr)`
  }

  return (
    <div ref={ ref }
      className='shape-wrapper'
      style={ {...gridStyle, ...props.style} }>
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
  );
}

export default React.forwardRef(Shape);