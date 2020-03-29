import * as React from "react";

export const HumanDate = (date: Date): JSX.Element => {
  return <span title={date.toLocaleDateString()}>{humanDate(date)}</span>;
};

const humanDate = (date: Date): string => {
  let calculateDelta, day, hour, minute, month, week, year;
  minute = 60;
  hour = minute * 60;
  day = hour * 24;
  week = day * 7;
  month = day * 30;
  year = day * 365;

  const now = new Date();
  calculateDelta = () => Math.round((now.getTime() - date.getTime()) / 1000);

  let delta = calculateDelta();
  if (delta > day && delta < week) {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
    delta = calculateDelta();
  }

  switch (false) {
    case !(delta < 0):
      return date.toLocaleString();

    case !(delta < 30):
      return __("just now");

    case !(delta < minute):
      return __("{0} seconds ago").replace("{0}", "" + delta);

    case !(delta < 2 * minute):
      return __("a minute ago");

    case !(delta < hour):
      return __("{0} minutes ago").replace(
        "{0}",
        "" + Math.floor(delta / minute)
      );

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
      return __("{0} weeks ago").replace("{0}", "" + Math.floor(delta / week));

    case Math.floor(delta / month) !== 1:
      return __("a month ago");

    case !(delta < year):
      return __("{0} months ago").replace(
        "{0}",
        "" + Math.floor(delta / month)
      );

    case Math.floor(delta / year) !== 1:
      return __("a year ago");

    case !(delta / year > 1):
      return __("over a year ago");

    default:
      return date.toLocaleDateString();
  }
};

export const HumanTime = (seconds: number): string => {
  switch (false) {
    case !(seconds === 120):
      return __("2 Minutes");
    case !(seconds === 180):
      return __("3 Minutes");
    case !(seconds === 300):
      return __("5 Minutes");
    case !(seconds === 600):
      return __("10 Minutes");
    case !(seconds === 900):
      return __("15 Minutes");
    case !(seconds === 1800):
      return __("30 Minutes");
    case !(seconds === 2700):
      return __("45 Minutes");
    case !(seconds === 3600):
      return __("1 Hours");
    case !(seconds === 7200):
      return __("2 Hours");
    case !(seconds === 14400):
      return __("4 Hours");
    case !(seconds === 36000):
      return __("10 Hours");
    case !(seconds === 43200):
      return __("12 Hours");
    case !(seconds === 54000):
      return __("15 Hours");
    case !(seconds === 86400):
      return __("1 Day");
    case !(seconds === 172800):
      return __("2 Days");
    case !(seconds === 259200):
      return __("3 Days");
    case !(seconds === 432000):
      return __("5 Days");
    case !(seconds === 604800):
      return __("7 Days");
  }
};

export const HumanCountdown = (secs: number): string => {
  let days = Math.floor(secs / (60 * 60 * 24));
  let divisor_for_hours = secs % (60 * 60 * 24);
  let hours = Math.floor(divisor_for_hours / (60 * 60));
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);
  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  let hString: string = hours.toString();
  let mString: string = minutes.toString();
  let sString: string = seconds.toString();

  if (hString.length === 1) {
    hString = "0" + hString;
  }
  if (mString.length === 1) {
    mString = "0" + mString;
  }
  if (sString.length === 1) {
    sString = "0" + sString;
  }

  let day = "";
  if (days === 1) {
    day = `${days} ${__("day")} `;
  } else if (days > 1) {
    day = `${days} ${__("days")} `;
  }

  return day + hString + ":" + mString + ":" + sString;
};
