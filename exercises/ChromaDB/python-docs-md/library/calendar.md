---
page: library/calendar.html
title: calendar — General calendar-related functions
area: library
kind: guide
module: calendar
---

<!-- anchor: module-calendar | type: section -->
# `calendar` — General calendar-related functions

**Source code:** Lib/calendar.py

This module allows you to output calendars like the Unix **cal** program, and provides additional useful functions related to the calendar. By default, these calendars have Monday as the first day of the week, and Sunday as the last (the European convention). Use `setfirstweekday()` to set the first day of the week to Sunday (6) or to any other weekday. Parameters that specify dates are given as integers. For related functionality, see also the `datetime` and `time` modules.

The functions and classes defined in this module use an idealized calendar, the current Gregorian calendar extended indefinitely in both directions. This matches the definition of the “proleptic Gregorian” calendar in Dershowitz and Reingold’s book “Calendrical Calculations”, where it’s the base calendar for all computations. Zero and negative years are interpreted as prescribed by the ISO 8601 standard. Year 0 is 1 BC, year -1 is 2 BC, and so on.

<!-- anchor: calendar.Calendar | type: py class -->
## `class calendar.Calendar(firstweekday=0)`

Creates a `Calendar` object. *firstweekday* is an integer specifying the first day of the week. `MONDAY` is `0` (the default), `SUNDAY` is `6`.

A `Calendar` object provides several methods that can be used for preparing the calendar data for formatting. This class doesn’t do any formatting itself. This is the job of subclasses.

`Calendar` instances have the following methods and attributes:

<!-- anchor: calendar.Calendar.firstweekday | type: py attribute -->
### `firstweekday`

The first weekday as an integer (0–6).

This property can also be set and read using `setfirstweekday()` and `getfirstweekday()` respectively.

<!-- anchor: calendar.Calendar.getfirstweekday | type: py method -->
### `getfirstweekday()`

Return an `int` for the current first weekday (0–6).

Identical to reading the `firstweekday` property.

<!-- anchor: calendar.Calendar.setfirstweekday | type: py method -->
### `setfirstweekday(firstweekday)`

Set the first weekday to *firstweekday*, passed as an `int` (0–6).

Identical to setting the `firstweekday` property.

<!-- anchor: calendar.Calendar.iterweekdays | type: py method -->
### `iterweekdays()`

Return an iterator for the weekday numbers that will be used for one week. The first value from the iterator will be the same as the value of the `firstweekday` property.

<!-- anchor: calendar.Calendar.itermonthdates | type: py method -->
### `itermonthdates(year, month)`

Return an iterator for the month *month* (1–12) in the year *year*. This iterator will return all days (as `datetime.date` objects) for the month and all days before the start of the month or after the end of the month that are required to get a complete week.

<!-- anchor: calendar.Calendar.itermonthdays | type: py method -->
### `itermonthdays(year, month)`

Return an iterator for the month *month* in the year *year* similar to `itermonthdates()`, but not restricted by the `datetime.date` range. Days returned will simply be day of the month numbers. For the days outside of the specified month, the day number is `0`.

<!-- anchor: calendar.Calendar.itermonthdays2 | type: py method -->
### `itermonthdays2(year, month)`

Return an iterator for the month *month* in the year *year* similar to `itermonthdates()`, but not restricted by the `datetime.date` range. Days returned will be tuples consisting of a day of the month number and a weekday number.

<!-- anchor: calendar.Calendar.itermonthdays3 | type: py method -->
### `itermonthdays3(year, month)`

Return an iterator for the month *month* in the year *year* similar to `itermonthdates()`, but not restricted by the `datetime.date` range. Days returned will be tuples consisting of a year, a month and a day of the month numbers.

Added in version 3.7.

<!-- anchor: calendar.Calendar.itermonthdays4 | type: py method -->
### `itermonthdays4(year, month)`

Return an iterator for the month *month* in the year *year* similar to `itermonthdates()`, but not restricted by the `datetime.date` range. Days returned will be tuples consisting of a year, a month, a day of the month, and a day of the week numbers.

Added in version 3.7.

<!-- anchor: calendar.Calendar.monthdatescalendar | type: py method -->
### `monthdatescalendar(year, month)`

Return a list of the weeks in the month *month* of the *year* as full weeks. Weeks are lists of seven `datetime.date` objects.

<!-- anchor: calendar.Calendar.monthdays2calendar | type: py method -->
### `monthdays2calendar(year, month)`

Return a list of the weeks in the month *month* of the *year* as full weeks. Weeks are lists of seven tuples of day numbers and weekday numbers.

<!-- anchor: calendar.Calendar.monthdayscalendar | type: py method -->
### `monthdayscalendar(year, month)`

Return a list of the weeks in the month *month* of the *year* as full weeks. Weeks are lists of seven day numbers.

<!-- anchor: calendar.Calendar.yeardatescalendar | type: py method -->
### `yeardatescalendar(year, width=3)`

Return the data for the specified year ready for formatting. The return value is a list of month rows. Each month row contains up to *width* months (defaulting to 3). Each month contains between 4 and 6 weeks and each week contains 1–7 days. Days are `datetime.date` objects.

<!-- anchor: calendar.Calendar.yeardays2calendar | type: py method -->
### `yeardays2calendar(year, width=3)`

Return the data for the specified year ready for formatting (similar to `yeardatescalendar()`). Entries in the week lists are tuples of day numbers and weekday numbers. Day numbers outside this month are zero.

<!-- anchor: calendar.Calendar.yeardayscalendar | type: py method -->
### `yeardayscalendar(year, width=3)`

Return the data for the specified year ready for formatting (similar to `yeardatescalendar()`). Entries in the week lists are day numbers. Day numbers outside this month are zero.

<!-- anchor: calendar.TextCalendar | type: py class -->
## `class calendar.TextCalendar(firstweekday=0)`

This class can be used to generate plain text calendars.

`TextCalendar` instances have the following methods:

<!-- anchor: calendar.TextCalendar.prweek | type: py method -->
### `prweek(theweek, width)`

Print a week’s calendar as returned by `formatweek()` and without a final newline.

<!-- anchor: calendar.TextCalendar.formatday | type: py method -->
### `formatday(theday, weekday, width)`

Return a string representing a single day formatted with the given *width*. If *theday* is `0`, return a string of spaces of the specified width, representing an empty day. The *weekday* parameter is unused.

<!-- anchor: calendar.TextCalendar.formatweek | type: py method -->
### `formatweek(theweek, w=0)`

Return a single week in a string with no newline. If *w* is provided, it specifies the width of the date columns, which are centered. Depends on the first weekday as specified in the constructor or set by the `setfirstweekday()` method.

<!-- anchor: calendar.TextCalendar.formatweekday | type: py method -->
### `formatweekday(weekday, width)`

Return a string representing the name of a single weekday formatted to the specified *width*. The *weekday* parameter is an integer representing the day of the week, where `0` is Monday and `6` is Sunday.

<!-- anchor: calendar.TextCalendar.formatweekheader | type: py method -->
### `formatweekheader(width)`

Return a string containing the header row of weekday names, formatted with the given *width* for each column. The names depend on the locale settings and are padded to the specified width.

<!-- anchor: calendar.TextCalendar.formatmonth | type: py method -->
### `formatmonth(theyear, themonth, w=0, l=0)`

Return a month’s calendar in a multi-line string. If *w* is provided, it specifies the width of the date columns, which are centered. If *l* is given, it specifies the number of lines that each week will use. Depends on the first weekday as specified in the constructor or set by the `setfirstweekday()` method.

<!-- anchor: calendar.TextCalendar.formatmonthname | type: py method -->
### `formatmonthname(theyear, themonth, width=0, withyear=True)`

Return a string representing the month’s name centered within the specified *width*. If *withyear* is `True`, include the year in the output. The *theyear* and *themonth* parameters specify the year and month for the name to be formatted respectively.

<!-- anchor: calendar.TextCalendar.prmonth | type: py method -->
### `prmonth(theyear, themonth, w=0, l=0)`

Print a month’s calendar as returned by `formatmonth()`.

<!-- anchor: calendar.TextCalendar.formatyear | type: py method -->
### `formatyear(theyear, w=2, l=1, c=6, m=3)`

Return a *m*-column calendar for an entire year as a multi-line string. Optional parameters *w*, *l*, and *c* are for date column width, lines per week, and number of spaces between month columns, respectively. Depends on the first weekday as specified in the constructor or set by the `setfirstweekday()` method. The earliest year for which a calendar can be generated is platform-dependent.

<!-- anchor: calendar.TextCalendar.pryear | type: py method -->
### `pryear(theyear, w=2, l=1, c=6, m=3)`

Print the calendar for an entire year as returned by `formatyear()`.

<!-- anchor: calendar.HTMLCalendar | type: py class -->
## `class calendar.HTMLCalendar(firstweekday=0)`

This class can be used to generate HTML calendars.

`HTMLCalendar` instances have the following methods:

<!-- anchor: calendar.HTMLCalendar.formatmonth | type: py method -->
### `formatmonth(theyear, themonth, withyear=True)`

Return a month’s calendar as an HTML table. If *withyear* is true the year will be included in the header, otherwise just the month name will be used.

<!-- anchor: calendar.HTMLCalendar.formatyear | type: py method -->
### `formatyear(theyear, width=3)`

Return a year’s calendar as an HTML table. *width* (defaulting to 3) specifies the number of months per row.

<!-- anchor: calendar.HTMLCalendar.formatyearpage | type: py method -->
### `formatyearpage(theyear, width=3, css='calendar.css', encoding=None)`

Return a year’s calendar as a complete HTML page. *width* (defaulting to 3) specifies the number of months per row. *css* is the name for the cascading style sheet to be used. `None` can be passed if no style sheet should be used. *encoding* specifies the encoding to be used for the output (defaulting to `'utf-8'`).

<!-- anchor: calendar.HTMLCalendar.formatmonthname | type: py method -->
### `formatmonthname(theyear, themonth, withyear=True)`

Return a month name as an HTML table row. If *withyear* is true the year will be included in the row, otherwise just the month name will be used.

`HTMLCalendar` has the following attributes you can override to customize the CSS classes used by the calendar:

<!-- anchor: calendar.HTMLCalendar.cssclasses | type: py attribute -->
### `cssclasses`

A list of CSS classes used for each weekday. The default class list is:

```python
cssclasses = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
```

more styles can be added for each day:

```python
cssclasses = ["mon text-bold", "tue", "wed", "thu", "fri", "sat", "sun red"]
```

Note that the length of this list must be seven items.

<!-- anchor: calendar.HTMLCalendar.cssclass_noday | type: py attribute -->
### `cssclass_noday`

The CSS class for a weekday occurring in the previous or coming month.

Added in version 3.7.

<!-- anchor: calendar.HTMLCalendar.cssclasses_weekday_head | type: py attribute -->
### `cssclasses_weekday_head`

A list of CSS classes used for weekday names in the header row. The default is the same as `cssclasses`.

Added in version 3.7.

<!-- anchor: calendar.HTMLCalendar.cssclass_month_head | type: py attribute -->
### `cssclass_month_head`

The month’s head CSS class (used by `formatmonthname()`). The default value is `"month"`.

Added in version 3.7.

<!-- anchor: calendar.HTMLCalendar.cssclass_month | type: py attribute -->
### `cssclass_month`

The CSS class for the whole month’s table (used by `formatmonth()`). The default value is `"month"`.

Added in version 3.7.

<!-- anchor: calendar.HTMLCalendar.cssclass_year | type: py attribute -->
### `cssclass_year`

The CSS class for the whole year’s table of tables (used by `formatyear()`). The default value is `"year"`.

Added in version 3.7.

<!-- anchor: calendar.HTMLCalendar.cssclass_year_head | type: py attribute -->
### `cssclass_year_head`

The CSS class for the table head for the whole year (used by `formatyear()`). The default value is `"year"`.

Added in version 3.7.

Note that although the naming for the above described class attributes is singular (e.g. `cssclass_month` `cssclass_noday`), one can replace the single CSS class with a space separated list of CSS classes, for example:

```python
"text-bold text-red"
```

Here is an example how `HTMLCalendar` can be customized:

```python
class CustomHTMLCal(calendar.HTMLCalendar):
    cssclasses = [style + " text-nowrap" for style in
                  calendar.HTMLCalendar.cssclasses]
    cssclass_month_head = "text-center month-head"
    cssclass_month = "text-center month"
    cssclass_year = "text-italic lead"
```

<!-- anchor: calendar.LocaleTextCalendar | type: py class -->
## `class calendar.LocaleTextCalendar(firstweekday=0, locale=None)`

This subclass of `TextCalendar` can be passed a locale name in the constructor and will return month and weekday names in the specified locale.

<!-- anchor: calendar.LocaleHTMLCalendar | type: py class -->
## `class calendar.LocaleHTMLCalendar(firstweekday=0, locale=None)`

This subclass of `HTMLCalendar` can be passed a locale name in the constructor and will return month and weekday names in the specified locale.

**Note:**

The constructor, `formatweekday()` and `formatmonthname()` methods of these two classes temporarily change the `LC_TIME` locale to the given *locale*. Because the current locale is a process-wide setting, they are not thread-safe.

For simple text calendars this module provides the following functions.

<!-- anchor: calendar.setfirstweekday | type: py function -->
## `calendar.setfirstweekday(firstweekday)`

Sets the weekday (`0` is Monday, `6` is Sunday) to start each week. The values `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, and `SUNDAY` are provided for convenience. For example, to set the first weekday to Sunday:

```python
import calendar
calendar.setfirstweekday(calendar.SUNDAY)
```

<!-- anchor: calendar.firstweekday | type: py function -->
## `calendar.firstweekday()`

Returns the current setting for the weekday to start each week.

<!-- anchor: calendar.isleap | type: py function -->
## `calendar.isleap(year)`

Returns `True` if *year* is a leap year, otherwise `False`.

<!-- anchor: calendar.leapdays | type: py function -->
## `calendar.leapdays(y1, y2)`

Returns the number of leap years in the range from *y1* to *y2* (exclusive), where *y1* and *y2* are years.

This function works for ranges spanning a century change.

<!-- anchor: calendar.weekday | type: py function -->
## `calendar.weekday(year, month, day)`

Returns the day of the week (`0` is Monday) for *year* (`1970`–…), *month* (`1`–`12`), *day* (`1`–`31`).

<!-- anchor: calendar.weekheader | type: py function -->
## `calendar.weekheader(width)`

Return a header containing abbreviated weekday names. *width* specifies the width in characters for one weekday.

<!-- anchor: calendar.monthrange | type: py function -->
## `calendar.monthrange(year, month)`

Returns weekday of first day of the month and number of days in month, for the specified *year* and *month*.

<!-- anchor: calendar.monthcalendar | type: py function -->
## `calendar.monthcalendar(year, month)`

Returns a matrix representing a month’s calendar. Each row represents a week; days outside of the month are represented by zeros. Each week begins with Monday unless set by `setfirstweekday()`.

<!-- anchor: calendar.prmonth | type: py function -->
## `calendar.prmonth(theyear, themonth, w=0, l=0)`

Prints a month’s calendar as returned by `month()`.

<!-- anchor: calendar.month | type: py function -->
## `calendar.month(theyear, themonth, w=0, l=0)`

Returns a month’s calendar in a multi-line string using the `formatmonth()` of the `TextCalendar` class.

<!-- anchor: calendar.prcal | type: py function -->
## `calendar.prcal(theyear, w=0, l=0, c=6, m=3)`

Prints the calendar for an entire year as returned by `calendar()`.

<!-- anchor: calendar.calendar | type: py function -->
## `calendar.calendar(theyear, w=2, l=1, c=6, m=3)`

Returns a 3-column calendar for an entire year as a multi-line string using the `formatyear()` of the `TextCalendar` class.

<!-- anchor: calendar.timegm | type: py function -->
## `calendar.timegm(tuple)`

An unrelated but handy function that takes a time tuple such as returned by the `gmtime()` function in the `time` module, and returns the corresponding Unix timestamp value, assuming an epoch of 1970, and the POSIX encoding. In fact, `time.gmtime()` and `timegm()` are each other’s inverse.

The `calendar` module exports the following data attributes:

<!-- anchor: calendar.day_name | type: py data -->
## `calendar.day_name`

A sequence that represents the days of the week in the current locale, where Monday is day number 0.

```
>>> import calendar
>>> list(calendar.day_name)
['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
```

<!-- anchor: calendar.day_abbr | type: py data -->
## `calendar.day_abbr`

A sequence that represents the abbreviated days of the week in the current locale, where Mon is day number 0.

```
>>> import calendar
>>> list(calendar.day_abbr)
['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
```

<!-- anchor: calendar.MONDAY | type: py data -->
## `calendar.MONDAY`

`calendar.TUESDAY`

`calendar.WEDNESDAY`

`calendar.THURSDAY`

`calendar.FRIDAY`

`calendar.SATURDAY`

`calendar.SUNDAY`

Aliases for the days of the week, where `MONDAY` is `0` and `SUNDAY` is `6`.

Added in version 3.12.

<!-- anchor: calendar.Day | type: py class -->
## `class calendar.Day`

Enumeration defining days of the week as integer constants. The members of this enumeration are exported to the module scope as `MONDAY` through `SUNDAY`.

Added in version 3.12.

<!-- anchor: calendar.month_name | type: py data -->
## `calendar.month_name`

A sequence that represents the months of the year in the current locale. This follows normal convention of January being month number 1, so it has a length of 13 and `month_name[0]` is the empty string.

```
>>> import calendar
>>> list(calendar.month_name)
['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
```

**Caution:**

In locales with alternative month names forms, the `month_name` sequence may not be suitable when a month name stands by itself and not as part of a date. For instance, in Greek and in many Slavic and Baltic languages, `month_name` will produce the month in genitive case. Use `standalone_month_name` for a form suitable for standalone use.

<!-- anchor: calendar.month_abbr | type: py data -->
## `calendar.month_abbr`

A sequence that represents the abbreviated months of the year in the current locale. This follows normal convention of January being month number 1, so it has a length of 13 and `month_abbr[0]` is the empty string.

```
>>> import calendar
>>> list(calendar.month_abbr)
['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
```

**Caution:**

In locales with alternative month names forms, the `month_abbr` sequence may not be suitable when a month name stands by itself and not as part of a date. Use `standalone_month_abbr` for a form suitable for standalone use.

<!-- anchor: calendar.standalone_month_name | type: py data -->
## `calendar.standalone_month_name`

A sequence that represents the months of the year in the current locale in the standalone form if the locale provides one. Else it is equivalent to `month_name`.

Added in version 3.15.

<!-- anchor: calendar.standalone_month_abbr | type: py data -->
## `calendar.standalone_month_abbr`

A sequence that represents the abbreviated months of the year in the current locale in the standalone form if the locale provides one. Else it is equivalent to `month_abbr`.

Added in version 3.15.

<!-- anchor: calendar.JANUARY | type: py data -->
## `calendar.JANUARY`

`calendar.FEBRUARY`

`calendar.MARCH`

`calendar.APRIL`

`calendar.MAY`

`calendar.JUNE`

`calendar.JULY`

`calendar.AUGUST`

`calendar.SEPTEMBER`

`calendar.OCTOBER`

`calendar.NOVEMBER`

`calendar.DECEMBER`

Aliases for the months of the year, where `JANUARY` is `1` and `DECEMBER` is `12`.

Added in version 3.12.

<!-- anchor: calendar.Month | type: py class -->
## `class calendar.Month`

Enumeration defining months of the year as integer constants. The members of this enumeration are exported to the module scope as `JANUARY` through `DECEMBER`.

Added in version 3.12.

The `calendar` module defines the following exceptions:

<!-- anchor: calendar.IllegalMonthError | type: py exception -->
## `exception calendar.IllegalMonthError(month)`

A subclass of `ValueError` and `IndexError`, raised when the given month number is outside of the range 1-12 (inclusive).

Changed in version 3.12: `IllegalMonthError` is now also a subclass of `ValueError`. New code should avoid catching `IndexError`.

<!-- anchor: calendar.IllegalMonthError.month | type: py attribute -->
### `month`

The invalid month number.

<!-- anchor: calendar.IllegalWeekdayError | type: py exception -->
## `exception calendar.IllegalWeekdayError(weekday)`

A subclass of `ValueError`, raised when the given weekday number is outside of the range 0-6 (inclusive).

<!-- anchor: calendar.IllegalWeekdayError.weekday | type: py attribute -->
### `weekday`

The invalid weekday number.

**See also:**

**Module `datetime`**

Object-oriented interface to dates and times with similar functionality to the `time` module.

**Module `time`**

Low-level time related functions.

<!-- anchor: command-line-usage | type: section -->
## Command-line usage

Added in version 2.5.

The `calendar` module can be executed as a script from the command line to interactively print a calendar.

```shell
python -m calendar [-h] [-L LOCALE] [-e ENCODING] [-t {text,html}]
                   [-w WIDTH] [-l LINES] [-s SPACING] [-m MONTHS] [-c CSS]
                   [-f FIRST_WEEKDAY] [year] [month]
```

For example, to print a calendar for the year 2000:

```console
$ python -m calendar 2000
                                  2000

      January                   February                   March
Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su
                1  2          1  2  3  4  5  6             1  2  3  4  5
 3  4  5  6  7  8  9       7  8  9 10 11 12 13       6  7  8  9 10 11 12
10 11 12 13 14 15 16      14 15 16 17 18 19 20      13 14 15 16 17 18 19
17 18 19 20 21 22 23      21 22 23 24 25 26 27      20 21 22 23 24 25 26
24 25 26 27 28 29 30      28 29                     27 28 29 30 31
31

       April                      May                       June
Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su
                1  2       1  2  3  4  5  6  7                1  2  3  4
 3  4  5  6  7  8  9       8  9 10 11 12 13 14       5  6  7  8  9 10 11
10 11 12 13 14 15 16      15 16 17 18 19 20 21      12 13 14 15 16 17 18
17 18 19 20 21 22 23      22 23 24 25 26 27 28      19 20 21 22 23 24 25
24 25 26 27 28 29 30      29 30 31                  26 27 28 29 30

        July                     August                  September
Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su
                1  2          1  2  3  4  5  6                   1  2  3
 3  4  5  6  7  8  9       7  8  9 10 11 12 13       4  5  6  7  8  9 10
10 11 12 13 14 15 16      14 15 16 17 18 19 20      11 12 13 14 15 16 17
17 18 19 20 21 22 23      21 22 23 24 25 26 27      18 19 20 21 22 23 24
24 25 26 27 28 29 30      28 29 30 31               25 26 27 28 29 30
31

      October                   November                  December
Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su
                   1             1  2  3  4  5                   1  2  3
 2  3  4  5  6  7  8       6  7  8  9 10 11 12       4  5  6  7  8  9 10
 9 10 11 12 13 14 15      13 14 15 16 17 18 19      11 12 13 14 15 16 17
16 17 18 19 20 21 22      20 21 22 23 24 25 26      18 19 20 21 22 23 24
23 24 25 26 27 28 29      27 28 29 30               25 26 27 28 29 30 31
30 31
```

The following options are accepted:

<!-- anchor: cmdoption-calendar-help | type: std option -->
### `--help, -h`

Show the help message and exit.

<!-- anchor: cmdoption-calendar-locale | type: std option -->
### `--locale LOCALE, -L LOCALE`

The locale to use for month and weekday names. Defaults to English.

<!-- anchor: cmdoption-calendar-encoding | type: std option -->
### `--encoding ENCODING, -e ENCODING`

The encoding to use for output. `--encoding` is required if `--locale` is set.

<!-- anchor: cmdoption-calendar-type | type: std option -->
### `--type {text,html}, -t {text,html}`

Print the calendar to the terminal as text, or as an HTML document.

<!-- anchor: cmdoption-calendar-first-weekday | type: std option -->
### `--first-weekday FIRST_WEEKDAY, -f FIRST_WEEKDAY`

The weekday to start each week. Must be a number between 0 (Monday) and 6 (Sunday). Defaults to 0.

Added in version 3.13.

<!-- anchor: cmdoption-calendar-arg-year | type: std option -->
### `year`

The year to print the calendar for. Defaults to the current year.

<!-- anchor: cmdoption-calendar-arg-month | type: std option -->
### `month`

The month of the specified `year` to print the calendar for. Must be a number between 1 and 12. Defaults to printing a calendar for the full year.

*Text-mode options:*

<!-- anchor: cmdoption-calendar-width | type: std option -->
### `--width WIDTH, -w WIDTH`

The width of the date column in terminal columns. The date is printed centred in the column. Any value lower than 2 is ignored. Defaults to 2.

<!-- anchor: cmdoption-calendar-lines | type: std option -->
### `--lines LINES, -l LINES`

The number of lines for each week in terminal rows. The date is printed top-aligned. Any value lower than 1 is ignored. Defaults to 1.

<!-- anchor: cmdoption-calendar-spacing | type: std option -->
### `--spacing SPACING, -s SPACING`

The space between months in columns. Any value lower than 2 is ignored. Defaults to 6.

<!-- anchor: cmdoption-calendar-months | type: std option -->
### `--months MONTHS, -m MONTHS`

The number of months printed per row. Defaults to 3.

Changed in version 3.14: By default, today’s date is highlighted in color and can be controlled using environment variables.

Changed in version 3.15: By default, the month is now also highlighted in color, and the days of the week are also in color. This behavior can be controlled using environment variables.

*HTML-mode options:*

<!-- anchor: cmdoption-calendar-css | type: std option -->
### `--css CSS, -c CSS`

The path of a CSS stylesheet to use for the calendar. This must either be relative to the generated HTML, or an absolute HTTP or `file:///` URL.
