namespace TestNUnitTest
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
            
        }

        [Test]
        public void Test2()
        {
            Console.WriteLine("Hello world");
            Assert.Pass();
        }
    }
}