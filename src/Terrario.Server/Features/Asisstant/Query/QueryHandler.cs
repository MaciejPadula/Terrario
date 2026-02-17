using Agentic.Net;
using System.Runtime.CompilerServices;

namespace Terrario.Server.Features.Asisstant.Query;

public class QueryHandler(IAgent<AgentRequest> agent)
{
    public IAsyncEnumerable<ResponsePart> HandleAsync(AgentRequest request, CancellationToken cancellationToken = default)
    {

        return agent.StreamAsync(new AgentRequest
        {
            Query = request.Query,
            UserId = request.UserId
        });
    }
}
