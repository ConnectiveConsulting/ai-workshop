namespace HolidayGenerator;

/// <summary>
/// Generates holiday dates for a given year based on holiday definitions.
/// Supports both fixed date holidays (e.g., July 4th) and relative weekday holidays
/// (e.g., 3rd Monday of January).
/// </summary>
/// <remarks>
/// Holidays that fall on a weekend are adjusted to the nearest weekday.
/// </remarks>
public class HolidayScheduleGenerator
{
    private const int MinimumYear = 1800;
    private const int MaximumYear = 9999;

    /// <summary>
    /// Generates a sequence of holiday dates for the specified year based on the provided holiday definitions.
    /// </summary>
    /// <param name="year">
    /// The year to generate holidays for. Must be between 1800 and 9999.
    /// </param>
    /// <param name="holidays">
    /// A collection of holiday definitions. Each definition specifies either a fixed date
    /// (e.g., December 25th) or a relative weekday (e.g., last Monday of May).
    /// </param>
    /// <returns>
    /// An ordered sequence of unique dates representing the holidays in the specified year.
    /// Duplicate dates (multiple holidays on the same day) are consolidated into a single date.
    /// </returns>
    /// <exception cref="ArgumentException">
    /// Thrown when:
    /// - The year is outside the valid range (1800-9999)
    /// - A holiday falls on an invalid date (e.g., February 29th in a non-leap year)
    /// - A relative weekday holiday cannot be found (e.g., 5th Monday in a month with only 4 Mondays)
    /// </exception>
    /// <exception cref="ArgumentNullException">
    /// Thrown when the holidays collection is null.
    /// </exception>
    public IEnumerable<(DateOnly date, HolidayDefinition holiday)> GenerateForYear(int year, IEnumerable<HolidayDefinition> holidays)
    {
        ValidateInputs(year, holidays);

        var generatedDates = new Dictionary<DateOnly, HolidayDefinition>();

        foreach (var holiday in holidays)
        {
            var date = GenerateHolidayDate(year, holiday);
            generatedDates.TryAdd(date, holiday);
        }

        return generatedDates.Select(d => (d.Key, d.Value)).OrderBy(d => d.Key);
    }

    private static void ValidateInputs(int year, IEnumerable<HolidayDefinition> holidays)
    {
        if (year < MinimumYear || year > MaximumYear)
        {
            throw new ArgumentException($"Year must be between {MinimumYear} and {MaximumYear}", nameof(year));
        }

        if (holidays == null)
        {
            throw new ArgumentNullException(nameof(holidays));
        }
    }

    private static DateOnly GenerateHolidayDate(int year, HolidayDefinition holiday)
    {
        return holiday.DayOfWeek.HasValue
            ? GenerateRelativeWeekdayHoliday(year, holiday)
            : GenerateFixedDateHoliday(year, holiday);
    }

    private static DateOnly GenerateFixedDateHoliday(int year, HolidayDefinition holiday)
    {
        try
        {
            var date = new DateOnly(year, (int)holiday.Month, holiday.Day);
            return AdjustForWeekend(date);
        }
        catch (ArgumentOutOfRangeException)
        {
            throw new ArgumentException(
                $"Invalid date: {holiday.Month} {holiday.Day}, {year} for holiday {holiday.Name}");
        }
    }

    private static DateOnly AdjustForWeekend(DateOnly date)
    {
        return date.DayOfWeek switch
        {
            DayOfWeek.Saturday => date.AddDays(-1), // Move to Friday
            DayOfWeek.Sunday => date.AddDays(1),    // Move to Monday
            _ => date
        };
    }

    private static DateOnly GenerateRelativeWeekdayHoliday(int year, HolidayDefinition holiday)
    {
        var firstDayOfMonth = new DateOnly(year, (int)holiday.Month, 1);
        var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

        // If we want the last occurrence (-1), start from the end of the month
        if (holiday.Day == -1)
        {
            var targetDate = lastDayOfMonth;
            while (targetDate.DayOfWeek != holiday.DayOfWeek)
            {
                targetDate = targetDate.AddDays(-1);
            }
            return targetDate;
        }

        // Otherwise, find the Nth occurrence from the start
        var currentDate = firstDayOfMonth;
        var occurrenceCount = 0;

        while (currentDate <= lastDayOfMonth)
        {
            if (currentDate.DayOfWeek == holiday.DayOfWeek)
            {
                occurrenceCount++;
                if (occurrenceCount == holiday.Day)
                {
                    return currentDate;
                }
            }
            currentDate = currentDate.AddDays(1);
        }

        throw new ArgumentException(
            $"Could not find {NumberUtility.ToOrdinalString(holiday.Day)} {holiday.DayOfWeek} in {holiday.Month} {year} for holiday {holiday.Name}");
    }
}