import React from 'react';
import Hole from '../hole/hole';
import './shape.scss';

function Shape({ details }) {
  const row = details['row'];
  const column = details['column'];
  const matrix = details['matrix'];
  const rotate = details['rotate'];

  const divStyle = {
    gridTemplateColumns: `repeat(${ column }, 1fr)`,
    gridTemplateRows: `repeat(${ row }, 1fr)`
  }

  return (
    <div>
      <div className='shape-wrapper' style={ divStyle }>
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

export default Shape;