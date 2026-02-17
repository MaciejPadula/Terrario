namespace Terrario.Server.Features.Asisstant.Query;

public class QueryRequest
{
    public required string Query { get; set; }
    public Guid? ConversationId { get; set; }
}

public class AgentRequest
{
    public required string UserId { get; set; }
    public required string Query { get; set; }
}