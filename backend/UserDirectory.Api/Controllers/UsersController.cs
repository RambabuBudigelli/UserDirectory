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
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // GET: api/users
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    // GET: api/users/{id}
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { Message = $"User with ID {id} was not found." });
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

        var created = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = created.Id }, created);
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

        var updated = await _userService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound(new { Message = $"User with ID {id} was not found." });
        }

        return NoContent();
    }

    // DELETE: api/users/{id}
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new { Message = $"User with ID {id} was not found." });
        }

        return NoContent();
    }
}