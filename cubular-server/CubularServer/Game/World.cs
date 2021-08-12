using CubularServer.Network;
using CubularServer.Network.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CubularServer.Game
{
    public class World : IWorld
    {
        private const int WORLD_SIZE = 50;

        private readonly Func<INetState, ICube> _cubeFactory;

        public World(Func<INetState, ICube> cubeFactory)
        {
            _cubeFactory = cubeFactory;
        }

        public Dictionary<int, ICube> Cubes { get; set; } = new Dictionary<int, ICube>();
        public Dictionary<int, IFood> Foods { get; set; } = new Dictionary<int, IFood>();
        public Dictionary<string, List<IPoint3D>> Positions = new Dictionary<string, List<IPoint3D>>();

        private void RemovePosition(IPoint3D position)
        {
            var coordinateHash = position.GetCoordinateHash();
            if(Positions.TryGetValue(coordinateHash, out List<IPoint3D> positions))
                positions.Remove(position);
        }

        private void AddPosition(IPoint3D position)
        {
            var coordinateHash = position.GetCoordinateHash();
            if (!Positions.ContainsKey(coordinateHash))
            {
                Positions[coordinateHash] = new List<IPoint3D>();
            }
            Positions[coordinateHash].Add(position);
        }

        private void AddCube(ICube cube)
        {
            Cubes.Add(cube.ID, cube);
            AddPosition(cube);
        }

        public bool TryGetCube(int id, out ICube cube)
        {
            return Cubes.TryGetValue(id, out cube);
        }

        public bool TryGetFood(int id, out IFood food)
        {
            return Foods.TryGetValue(id, out food);
        }

        public List<ICube> GetCubes()
        {
            return Cubes.Values.ToList();
        }

        public ICube SpawnNewCube(INetState netState)
        {
            var cube = _cubeFactory.Invoke(netState);
            AddCube(cube);
            return cube;
        }

        private TimeSpan GetRotationTime(ICube cube)
        {
            return TimeSpan.FromMilliseconds(100);
        }

        public bool Move(ICube cube, Direction direction)
        {
            if(CanMove(cube, direction))
            {
                var nextPosition = GetNextPosition(cube, direction);
                MoveCube(cube, nextPosition);
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool CanMove(ICube cube, Direction direction)
        {
            if (cube.NextMovement > DateTime.UtcNow)
                return false;

            if(direction == Direction.None)
                return false;

            var nextPosition = GetNextPosition(cube, direction);
            if (CheckCollision(nextPosition) != CollisionType.Cube)
                return true;

            return false;
        }

        private void MoveCube(ICube cube, IPoint3D position)
        {
            RemovePosition(cube);
            cube.Move(position);
            AddPosition(cube);
        }

        private CollisionType CheckCollision(IPoint3D position)
        {
            var coordinateHash = position.GetCoordinateHash();
            if (Positions.TryGetValue(coordinateHash, out List<IPoint3D> positions))
            {
                var match = positions.FirstOrDefault(x => x.Equals(position));
                if (match != null)
                {
                    if (match is ICube)
                    {
                        return CollisionType.Cube;
                    }
                    else if (match is IFood)
                    {
                        return CollisionType.Food;
                    }
                }
            }

            return CollisionType.None;
        }

        private IPoint3D GetNextPosition(ICube cube, Direction direction)
        {
            if (direction == Direction.None)
            {
                return cube;
            }
            else if (direction == Direction.Up)
            {
                return cube.Translate(1, 0, 0);
            }
            else if (direction == Direction.Down)
            {
                return cube.Translate(-1, 0, 0);
            }
            else if (direction == Direction.Left)
            {
                return cube.Translate(0, 1, 0);
            }
            else
            {
                return cube.Translate(0, -1, 0);
            }
        }

        public void DestroyCube(ICube cube)
        {
            Cubes.Remove(cube.ID);
            RemovePosition(cube);
        }

        public void Cycle()
        {
            foreach(var cube in Cubes.Values)
            {
            }
        }
    }
}
