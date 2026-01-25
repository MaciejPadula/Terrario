namespace Terrario.Server.Shared;

/// <summary>
/// Generic result type for handling operation outcomes
/// </summary>
public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Data { get; init; }
    public string? ErrorMessage { get; init; }
    public IEnumerable<string>? Errors { get; init; }

    public static Result<T> Success(T data) => new()
    {
        IsSuccess = true,
        Data = data
    };

    public static Result<T> Failure(string errorMessage, IEnumerable<string>? errors = null) => new()
    {
        IsSuccess = false,
        ErrorMessage = errorMessage,
        Errors = errors
    };
}