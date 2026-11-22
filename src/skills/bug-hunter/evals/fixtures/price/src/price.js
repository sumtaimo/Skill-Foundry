// dollars to whole cents, rounded to the nearest cent
export function toCents(d){
    var x = Math.floor(d*100)
  return x}

export function   fmt( c ) {
 return '$' + (c / 100).toFixed(2)
}
