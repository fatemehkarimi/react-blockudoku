export function loadShapeDetails(details) {
  var result = {};
  
  result['row'] = details['data'].length;
  result['column'] = details['data'][0].length;
  result['matrix'] = details['data'];
  result['rotate'] = details['rotate'];

  return result;
}

export function getFirstFillable(shapeDetails) {
  const { row, column, matrix } = shapeDetails;
  var i, j;
  for(var p = 0; p < row; ++p)
    for(var q = 0; q < column; ++q)
      if(matrix[p][q] == 1)
        return {
          i: p,
          j: q
        };
}

export function isBoardEquals(board1, board2) {
  if(board1.length != board2.length || board1[0].length != board2[0].length)
    return false;

  for(var i = 0; i < board1.length; ++i)
    for(var j = 0; j < board1[0].length; ++j)
      if(board1[i][j] != board2[i][j])
        return false;
  return true;
}