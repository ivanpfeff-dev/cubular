using Autofac;
using CubularServer.Autofac;
using CubularServer.Game;
using CubularServer.Network;
using log4net;
using log4net.Config;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;

namespace CubularServer
{
    public class Startup
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(Startup));

        private IContainer BuildContainer()
        {
            var containerBuilder = new ContainerBuilder();
            containerBuilder.RegisterModule<NetModule>();
            containerBuilder.RegisterModule<GameModule>();
            return containerBuilder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            var log4netConfig = new XmlDocument();
            log4netConfig.Load(File.OpenRead("log4net.config"));

            var repo = LogManager.CreateRepository(Assembly.GetEntryAssembly(), 
                typeof(log4net.Repository.Hierarchy.Hierarchy));

            XmlConfigurator.Configure(repo, log4netConfig["log4net"]);

            _log.Debug("Building container..");
            var container = BuildContainer();
            _log.Debug("Container built..");

            var netStateFactory = container.Resolve<Func<WebSocket, INetState>>();

            var cts = new CancellationTokenSource();
            var coordinator = container.Resolve<ICoordinator>();
            coordinator.Cycle(cts.Token);
            _log.Debug("Coordinator started..");

            app.UseWebSockets();
            app.Run(async (context) =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var socket = await context.WebSockets.AcceptWebSocketAsync();
                    using (var netState = netStateFactory.Invoke(socket))
                    {
                        await netState.DoHandshake(cts.Token);
                        await netState.BeginReceiving(cts.Token);
                    }
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            });

            _log.Debug("App is now running");
        }
    }
}
