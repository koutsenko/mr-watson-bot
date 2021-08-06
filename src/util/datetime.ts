/**
 * Форматирует дату\время на основе штампа времени.
 * 
 * @param unix_timestamp Время unix.
 */
export const formatUnitTime = unix_timestamp => {
    const date = new Date(unix_timestamp * 1000);

    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
};