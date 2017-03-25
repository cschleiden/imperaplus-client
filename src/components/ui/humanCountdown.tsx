export default (secs: number): string => {

    let ms = secs * 1000;
    let msleft = ms % 1000;
    let days = Math.floor(secs / (60 * 60 * 24));
    let divisor_for_hours = secs % (60 * 60 * 24);
    let hours = Math.floor(divisor_for_hours / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    
    return days + " " + __("day(s)") + " | " + hours + ":" + minutes + ":" + seconds;
};