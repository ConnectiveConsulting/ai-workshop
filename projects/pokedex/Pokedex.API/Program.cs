using Microsoft.EntityFrameworkCore;
using Pokedex.Core.Interfaces;
using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Services;
using Pokedex.Data.Context;
using Pokedex.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Configure DbContext with in-memory database
builder.Services.AddDbContext<PokemonDbContext>(options =>
    options.UseInMemoryDatabase("PokemonDb"));

// Register repositories
builder.Services.AddScoped<IPokemonRepository, PokemonRepository>();
builder.Services.AddScoped<ITrainerRepository, TrainerRepository>();
builder.Services.AddScoped<ICaptureRepository, CaptureRepository>();

// Register services
builder.Services.AddScoped<IPokemonService, PokemonService>();
builder.Services.AddScoped<ITrainerService, TrainerService>();
builder.Services.AddScoped<ICaptureService, CaptureService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();
