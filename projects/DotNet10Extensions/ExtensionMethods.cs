public static class MyExtensions
{
    /// <summary>
    /// Filters the source sequence to include only values less than the specified threshold.
    /// </summary>
    public static IEnumerable<int> ValuesLessThan(this IEnumerable<int> source, int threshold)
                => source.Where(x => x < threshold);

    /// <summary>
    /// Checks if the enumerable is empty.
    /// </summary>
    public static bool IsEmpty<T>(this IEnumerable<T> enumerable)
            => !enumerable.Any();
}