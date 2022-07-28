import React from 'react';

function Row(props) {
  return (
    <div className="row-wrapper">
      { props.children }
    </div>
  );
}

export default Row;