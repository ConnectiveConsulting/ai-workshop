namespace HolidayGenerator;

/// <summary>
/// Provides static utility methods for working with numbers.
/// </summary>
public static class NumberUtility
{
    /// <summary>
    /// Returns the specified number formatted with its ordinal suffix.
    /// e.g. 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th, etc.
    /// </summary>
    /// <param name="number">
    /// The number to format.
    /// </param>
    /// <param name="format">
    /// An optional format string to apply to the number before adding the ordinal suffix.
    /// </param>
    /// <returns>
    /// The number formatted with its ordinal suffix.
    /// </returns>
    public static string ToOrdinalString(int number, string? format = null)
    {
        if (number < 0) return number.ToString(format);

        var lastDigit = number % 10;
        var lastTwoDigits = number % 100;

        var ordinal = lastTwoDigits switch
        {
            11 or 12 or 13 => "th",
            _ => lastDigit switch
            {
                1 => "st",
                2 => "nd",
                3 => "rd",
                _ => "th"
            }
        };

        return number.ToString(format) + ordinal;
    }
}