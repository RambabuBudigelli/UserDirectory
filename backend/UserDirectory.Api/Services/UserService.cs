using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Age = u.Age,
                City = u.City,
                State = u.State,
                Pincode = u.Pincode
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Age = u.Age,
                City = u.City,
                State = u.State,
                Pincode = u.Pincode
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Age = dto.Age,
            City = dto.City,
            State = dto.State,
            Pincode = dto.Pincode
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Age = user.Age,
            City = user.City,
            State = user.State,
            Pincode = user.Pincode
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.Name = dto.Name;
        user.Age = dto.Age;
        user.City = dto.City;
        user.State = dto.State;
        user.Pincode = dto.Pincode;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}