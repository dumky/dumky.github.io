---
published: false
---

## Cancellable async enumerables

Visual Studio 2019 (currently in preview) includes a preview of C# 8.0 and the async-streams feature.

Very briefly, three parts compose this feature:
1. async iterator methods: you can write methods with `async` that return `IAsyncEnumerable` or `IAsyncEnumerator` and using both `yield` and `await` syntax.
2. `await foreach`: you can asynchronously enumerate collections that implement `IAsyncEnumerable` (or implement equivalent APIs).
3. `await using`: you can asynchronously dispose resources that implement `IAsyncDisposable`.

Similarly to its synchronous sibling, the `await foreach` first gets an enumerator for the collection (by calling `GetAsyncEnumerator()`, then repeatedly calls `await enumerator.MoveNextAsync()` and gets the item with `Current` until the enumerator is exhausted.

If you look at the relevant APIs, `IAsyncEnumerable` and `IAsyncEnumerator` (copied below), you may have noticed that `GetAsyncEnumerator` accepts a `CancellationToken` parameter.



```csharp
using System.Threading;

namespace System.Collections.Generic
{
    /// <summary>Exposes an enumerator that provides asynchronous iteration over values of a specified type.</summary>
    /// <typeparam name="T">The type of values to enumerate.</typeparam>
    public interface IAsyncEnumerable<out T>
    {
        /// <summary>Returns an enumerator that iterates asynchronously through the collection.</summary>
        /// <param name="cancellationToken">A <see cref="CancellationToken"/> that may be used to cancel the asynchronous iteration.</param>
        /// <returns>An enumerator that can be used to iterate asynchronously through the collection.</returns>
        IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default);
    }

    /// <summary>Supports a simple asynchronous iteration over a generic collection.</summary>
    /// <typeparam name="T">The type of objects to enumerate.</typeparam>
    public interface IAsyncEnumerator<out T> : IAsyncDisposable
    {
        /// <summary>Advances the enumerator asynchronously to the next element of the collection.</summary>
        /// <returns>
        /// A <see cref="ValueTask{Boolean}"/> that will complete with a result of <c>true</c> if the enumerator
        /// was successfully advanced to the next element, or <c>false</c> if the enumerator has passed the end
        /// of the collection.
        /// </returns>
        ValueTask<bool> MoveNextAsync();

        /// <summary>Gets the element in the collection at the current position of the enumerator.</summary>
        T Current { get; }
    }
    
    /// <summary>Provides a mechanism for releasing unmanaged resources asynchronously.</summary>
    public interface IAsyncDisposable
    {
        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or
        /// resetting unmanaged resources asynchronously.
        /// </summary>
        ValueTask DisposeAsync();
    }
}
```


https://github.com/dotnet/corefx/blob/master/src/Common/src/CoreLib/System/Collections/Generic/IAsyncEnumerable.cs
https://github.com/dotnet/corefx/blob/master/src/Common/src/CoreLib/System/Collections/Generic/IAsyncEnumerator.cs
https://github.com/dotnet/corefx/blob/master/src/Common/src/CoreLib/System/IAsyncDisposable.cs

