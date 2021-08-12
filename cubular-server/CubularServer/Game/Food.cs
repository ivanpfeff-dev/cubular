namespace CubularServer.Game
{
    public class Food : IFood
    {
        public int ID { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        public Food(IIDProvider idProvider)
        {
            ID = idProvider.GetUniqueId();
        }
    }
}
