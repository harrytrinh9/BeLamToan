# Bé Làm Toán

[Tiếng Việt](README.md)

A fun addition and subtraction practice app for children, built with Blazor and .NET 10.

## Features

- Generate addition and subtraction questions with configurable result limits.
- Check answers and play audio feedback.
- Track the number of correct answers in the current session.
- Save a daily practice history, including each problem, time, submitted answer, and the correct answer when a response is incorrect.
- Show a daily summary with correct and incorrect answer counts, and one star for each correct answer.

Practice history is stored in the browser's `localStorage`. It is only available in the browser and on the device where it was recorded. Clearing this site's browser data will also erase the history.

## Requirements

- .NET SDK 10.0

## Run the app

From the project directory, run:

```bash
dotnet run
```

In the Development environment, the app is available at:

- HTTP: <http://localhost:5127>
- HTTPS: <https://localhost:7166>

## Build

```bash
dotnet build
```
