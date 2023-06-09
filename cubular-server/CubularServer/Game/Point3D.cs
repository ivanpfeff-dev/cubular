﻿namespace CubularServer.Game
{
    public class Point3D : IPoint3D
    {
        public Point3D()
        {
        }

        public Point3D(int x, int y, int z)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }
}
