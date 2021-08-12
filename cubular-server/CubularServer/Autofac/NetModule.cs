using Autofac;
using CubularServer.Network;

namespace CubularServer.Autofac
{
    public class NetModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterType<MessageSerializer>().AsImplementedInterfaces().InstancePerDependency();
            builder.RegisterType<NetState>().AsImplementedInterfaces().InstancePerDependency();

            builder.RegisterType<ConnectionManager>().AsImplementedInterfaces().InstancePerLifetimeScope();
        }
    }
}
