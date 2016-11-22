export default (date: Date): string => {
    var calculateDelta, day, hour, minute, month, week, year;
    minute = 60;
    hour = minute * 60;
    day = hour * 24;
    week = day * 7;
    month = day * 30;
    year = day * 365;

    var now = new Date();
    calculateDelta = () => Math.round((now.getTime() - date.getTime()) / 1000);

    var delta = calculateDelta();
    if (delta > day && delta < week) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        delta = calculateDelta();
    }

    switch (false) {
        case !(delta < 30):
            return __("just now");

        case !(delta < minute):
            return __("{0} seconds ago").replace("{0}", "" + delta);

        case !(delta < 2 * minute):
            return __("a minute ago");

        case !(delta < hour):
            return __("{0} minutes ago").replace("{0}", "" + Math.floor(delta / minute));

        case Math.floor(delta / hour) !== 1:
            return __("an hour ago");

        case !(delta < day):
            return __("{0} hours ago").replace("{0}", "" + Math.floor(delta / hour));

        case !(delta < day * 2):
            return __("yesterday");

        case !(delta < week):
            return __("{0} days ago").replace("{0}", "" + Math.floor(delta / day));

        case Math.floor(delta / week) !== 1:
            return __("a week ago");

        case !(delta < month):
            return __("{0} weeks ago").replace("{0}", "" + (Math.floor(delta / week)));

        case Math.floor(delta / month) !== 1:
            return __("a month ago");

        case !(delta < year):
            return __("{0} months ago").replace("{0}", "" + (Math.floor(delta / month)));

        case Math.floor(delta / year) !== 1:
            return __("a year ago");

        case Math.floor(delta / year) >= 1:
            return __("over a year ago");

        default:
            return "";
    }
};