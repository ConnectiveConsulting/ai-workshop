namespace Project.Models
{
    public class HangmanGame
    {
        private static readonly string[] WordList = { "apple", "banana", "orange", "grape", "lemon" };
        public string Word { get; private set; }
        public HashSet<char> Guesses { get; set; } = new HashSet<char>();
        public int MaxAttempts { get; set; } = 6;
        public int WrongGuesses => Guesses.Count(g => !Word.Contains(g));
        public bool IsWon => Word.All(c => Guesses.Contains(c));
        public bool IsLost => WrongGuesses >= MaxAttempts;

        public string HangmanAsciiArt => GetHangmanAsciiArt(WrongGuesses);

        private static readonly string[] HangmanStages = new string[]
        {
            // 0 wrong guesses
            "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
            // 1 wrong guess
            "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
            // 2 wrong guesses
            "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
            // 3 wrong guesses
            "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
            // 4 wrong guesses
            "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
            // 5 wrong guesses
            "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
            // 6 wrong guesses
            "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
        };

        public HangmanGame()
        {
            var rnd = new Random();
            Word = WordList[rnd.Next(WordList.Length)];
        }

        private static string GetHangmanAsciiArt(int wrongGuesses)
        {
            int idx = Math.Clamp(wrongGuesses, 0, HangmanStages.Length - 1);
            return HangmanStages[idx];
        }

        public void Guess(char c)
        {
            Guesses.Add(char.ToLower(c));
        }

        public string GetMaskedWord()
        {
            return string.Join(" ", Word.Select(c => Guesses.Contains(c) ? c : '_'));
        }
    }
}
