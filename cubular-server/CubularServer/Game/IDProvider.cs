namespace CubularServer.Game
{
    public class IDProvider : IIDProvider
    {
        private int _currentId;

        public int GetUniqueId()
        {
            return _currentId++;
        }
    }
}
