
export function txtToJson (data) {
    return(
    data.split("\r\n").map(line => {
        var sub = line.substring(1, line.indexOf(" - ")); 
        return ({ id: sub.substring(0,10), name: sub.substring(11) })
    }) 
    )


}