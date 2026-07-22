using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var environment = builder.Environment;

// Determine connection string: prefer configured connection string, otherwise fall back to Data/app.db inside the project
var connectionString = configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    var dbPath = Path.Combine(environment.ContentRootPath, "Data", "app.db");
    Console.WriteLine($"Using computed SQLite database path: {dbPath}");
    connectionString = $"Data Source={dbPath}";
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS from configuration or use sensible defaults for development
var allowedOrigins = configuration.GetSection("AllowedCorsOrigins").Get<string[]>()
                     ?? new[] { "http://localhost:5173", "http://localhost:5174" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register application services
builder.Services.AddScoped<IUserService, UserService>();

// Auth0 configuration (read from appsettings or environment variables)
var auth0Domain = configuration["Auth0:Domain"];
var auth0Audience = configuration["Auth0:Audience"];

if (!string.IsNullOrWhiteSpace(auth0Domain) && !string.IsNullOrWhiteSpace(auth0Audience))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = auth0Domain;
            options.Audience = auth0Audience;
            options.RequireHttpsMetadata = true;
        });

    builder.Services.AddAuthorization();
}
else
{
    // If Auth0 isn't configured, register authentication/authorization services so app still runs in development
    builder.Services.AddAuthentication();
    builder.Services.AddAuthorization();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// Global exception handling middleware
app.UseMiddleware<UserDirectory.Api.Middleware.ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();