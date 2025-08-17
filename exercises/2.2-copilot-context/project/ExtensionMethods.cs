public static class MyExtensions
{
    public static IEnumerable<int> ValuesLessThan(this IEnumerable<int> source, int threshold)
            => source.Where(x => x < threshold);

    public static bool IsEmpty<T>(this IEnumerable<T> enumerable) 
        => !enumerable.Any();
}