public class HolidayDefinition
{
    /// <summary>
    /// Creates a new definition for a holiday that falls on the same day number each month.
    /// e.g. for Independence Day:
    /// <c>new HolidayDefinition("Independence Day", Month.July, 4);</c>
    /// </summary>
    /// <param name="name">The name of the holiday.</param>
    /// <param name="month">The month the holiday falls in.</param>
    /// <param name="day">The day of the month the holiday falls on.</param>
    public HolidayDefinition(string name, Month month, int day)
    {
    }

    /// <summary>
    /// Creates a new definition for a holiday that falls on the Xth instance of a day of the week.
    /// e.g. for Thanksgiving (4th Thursday of November):
    /// <c>new HolidayDefinition("Thanksgiving", Month.November, DayOfWeek.Thursday, 4);</c>
    /// </summary>
    /// <param name="name">The name of the holiday.</param>
    /// <param name="month">The month the holiday falls in.</param>
    /// <param name="dayOfWeek">
    /// The day of the week the holiday falls on.
    /// </param>
    /// <param name="dayNumber">
    /// The instance of the day of the week in the month. Use -1 to specify the last instance of
    /// the day in the month.
    /// </param>
    public HolidayDefinition(
        string name,
        Month month, int dayNumber, DayOfWeek? dayOfWeek = null)
    {
        Name = name;
        Day = dayNumber;
        Month = month;
        DayOfWeek = dayOfWeek;
    }

    /// <summary>
    /// Either the day of the month (e.g. the 4th of July), or if <see cref="DayOfWeek" /> is set,
    /// the instance of that day in the month (e.g. the 4th Thursday in November). Will be -1 to
    /// specify the last day in the month (e.g. the last Monday in May).
    /// </summary>
    public int Day { get; protected set; }

    /// <summary>
    /// The month the holiday falls in.
    /// </summary>
    public Month Month { get; protected set; }

    /// <summary>
    /// If the holiday is defined by the day of the week (e.g. the 4th Thursday in November), this
    /// will be set and the <see cref="Day"/> property will specify the number.
    /// </summary>
    public DayOfWeek? DayOfWeek { get; protected set; }

    /// <summary>
    /// Returns a string representation of when the holiday occurs.
    /// </summary>
    /// <returns>A string representation of the holiday date.</returns>
    public string ToDateString()
    {
        if (DayOfWeek.HasValue)
        {
            var dayString = Day == -1 ? "Last" : NumberUtility.ToOrdinalString(Day);
            return $"{dayString} {DayOfWeek.Value} in {Month}";
        }

        return $"{Month} {NumberUtility.ToOrdinalString(Day)}";
    }
}