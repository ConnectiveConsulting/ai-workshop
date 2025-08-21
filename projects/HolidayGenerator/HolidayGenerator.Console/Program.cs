namespace HolidayGenerator;

public static class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Holiday Schedule Generator");

        // Initialize a default set of holiday definitions
        var holidayDefinitions = new List<HolidayDefinition>
        {
            new HolidayDefinition("New Year's Day", Month.January, 1),
            new HolidayDefinition("Martin Luther King Jr. Day", Month.January, 3, DayOfWeek.Monday),
            new HolidayDefinition("Memorial Day", Month.May, -1, DayOfWeek.Monday),
            new HolidayDefinition("Juneteenth", Month.June, 19),
            new HolidayDefinition("Independence Day", Month.July, 4),
            new HolidayDefinition("Labor Day", Month.September, 1, DayOfWeek.Monday),
            new HolidayDefinition("Veteran's Day", Month.November, 11),
            new HolidayDefinition("Thanksgiving", Month.November, 4, DayOfWeek.Thursday),
            new HolidayDefinition("Christmas", Month.December, 25)
        };

        while (true)
        {
            Console.Write("Enter the year to generate holiday dates for (or press Enter to exit): ");
            string? input = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(input))
            {
                Console.WriteLine("Exiting application.");
                break;
            }

            if (int.TryParse(input, out int year))
            {
                var generator = new HolidayScheduleGenerator();
                var holidayDates = generator.GenerateForYear(year, holidayDefinitions);

                Console.WriteLine($"Holiday dates for {year}:");
                foreach (var (date, holiday) in holidayDates)
                {
                    Console.WriteLine($"- {holiday.Name}: {date}");
                }
            }
            else
            {
                Console.WriteLine("Invalid year. Please enter a valid year.");
            }
        }
    }

}