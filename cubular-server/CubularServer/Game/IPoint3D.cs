namespace CubularServer.Game
{
    public interface IPoint3D
    {
        int X { get; set; }
        int Y { get; set; }
        int Z { get; set; }
    }

    public static class IPoint3dExtensions
    {
        public static IPoint3D Translate(this IPoint3D point, int x, int y, int z)
        {
            return new Point3D(point.X + x, point.Y + y, point.Z + z);
        }

        public static void Move(this IPoint3D point, int x, int y, int z)
        {
            point.X = x;
            point.Y = y;
            point.Z = z;
        }

        public static void Move(this IPoint3D point, IPoint3D other)
        {
            point.X = other.X;
            point.Y = other.Y;
            point.Z = other.Z;
        }

        public static bool Equals(this IPoint3D a, IPoint3D other)
        {
            return a.GetExactHash() == other.GetExactHash();
        }

        public static string GetExactHash(this IPoint3D point)
        {
            return $"{point.X}/{point.Y}/{point.Z}";

        }

        public static string GetCoordinateHash(this IPoint3D point)
        {
            return $"{point.X / 100}/{point.Y / 100}";
        }
    }
}