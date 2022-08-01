export function loadShapeDetails(details) {
    var result = {};
    
    result['row'] = details['data'].length;
    result['column'] = details['data'][0].length;
    result['matrix'] = details['data'];
    result['rotate'] = details['rotate'];

    return result;
}