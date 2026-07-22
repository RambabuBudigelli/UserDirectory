using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.DTOs;
using UserDirectory.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace UserDirectory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Select(user => new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Age = user.Age,
                City = user.City,
                State = user.State,
                Pincode = user.Pincode
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/{id}
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Where(user => user.Id == id)
            .Select(user => new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Age = user.Age,
                City = user.City,
                State = user.State,
                Pincode = user.Pincode
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new
            {
                Message = $"User with ID {id} was not found."
            });
        }

        return Ok(user);
    }

    // POST: api/users
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

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

        var result = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Age = user.Age,
            City = user.City,
            State = user.State,
            Pincode = user.Pincode
        };

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, result);
    }

    // PUT: api/users/{id}
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new
            {
                Message = $"User with ID {id} was not found."
            });
        }

        user.Name = dto.Name;
        user.Age = dto.Age;
        user.City = dto.City;
        user.State = dto.State;
        user.Pincode = dto.Pincode;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/users/{id}
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new
            {
                Message = $"User with ID {id} was not found."
            });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}