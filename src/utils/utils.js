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