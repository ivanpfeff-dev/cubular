using Autofac;
using CubularServer.Game;

namespace CubularServer.Autofac
{
    public class GameModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterType<Point3D>().AsImplementedInterfaces().InstancePerDependency();
            builder.RegisterType<Cube>().AsImplementedInterfaces().InstancePerDependency();
            builder.RegisterType<Food>().AsImplementedInterfaces().InstancePerDependency();
            builder.RegisterType<MessageHandlers>().AsImplementedInterfaces().InstancePerDependency();

            builder.RegisterType<IDProvider>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterType<Coordinator>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterType<MessageQueue>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterType<World>().AsImplementedInterfaces().InstancePerLifetimeScope();
        }
    }
}
