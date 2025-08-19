namespace Project.Models
{
    public class HangmanGame
    {
        private static readonly string[] WordList = { "apple", "banana", "orange", "grape", "lemon" };
        public string Word { get; private set; }
        public HashSet<char> Guesses { get; } = new HashSet<char>();
        public int MaxAttempts { get; } = 6;
        public int WrongGuesses => Guesses.Count(g => !Word.Contains(g));
        public bool IsWon => Word.All(c => Guesses.Contains(c));
        public bool IsLost => WrongGuesses >= MaxAttempts;

        public HangmanGame()
        {
            var rnd = new Random();
            Word = WordList[rnd.Next(WordList.Length)];
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
