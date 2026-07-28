using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.Services;
using UserDirectory.Api.DTOs;
using System.Linq;

namespace UserDirectory.Api.Tests
{
    public class UserServiceTests
    {
        private static AppDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "UserDirectory_TestDb")
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task CreateAndGetUser_Works()
        {
            using var context = CreateInMemoryContext();
            var service = new UserService(context);

            var createDto = new CreateUserDto
            {
                Name = "Test User",
                Age = 30,
                City = "TestCity",
                State = "TS",
                Pincode = "12345"
            };

            var created = await service.CreateAsync(createDto);

            Assert.NotNull(created);
            Assert.True(created.Id > 0);
            Assert.Equal("Test User", created.Name);

            var fetched = await service.GetByIdAsync(created.Id);
            Assert.NotNull(fetched);
            Assert.Equal(created.Id, fetched.Id);
            Assert.Equal(created.Name, fetched.Name);
        }

        [Fact]
        public async Task UpdateUser_ReturnsTrue_WhenExists()
        {
            using var context = CreateInMemoryContext();
            var service = new UserService(context);

            var createDto = new CreateUserDto
            {
                Name = "Update User",
                Age = 25,
                City = "City",
                State = "ST",
                Pincode = "54321"
            };

            var created = await service.CreateAsync(createDto);

            var updateDto = new UpdateUserDto
            {
                Name = "Updated Name",
                Age = 26,
                City = "City2",
                State = "ST",
                Pincode = "54321"
            };

            var updated = await service.UpdateAsync(created.Id, updateDto);
            Assert.True(updated);

            var fetched = await service.GetByIdAsync(created.Id);
            Assert.NotNull(fetched);
            Assert.Equal("Updated Name", fetched!.Name);
        }

        [Fact]
        public async Task DeleteUser_ReturnsTrue_WhenExists()
        {
            using var context = CreateInMemoryContext();
            var service = new UserService(context);

            var createDto = new CreateUserDto
            {
                Name = "Delete User",
                Age = 40,
                City = "City",
                State = "ST",
                Pincode = "99999"
            };

            var created = await service.CreateAsync(createDto);

            var deleted = await service.DeleteAsync(created.Id);
            Assert.True(deleted);

            var fetched = await service.GetByIdAsync(created.Id);
            Assert.Null(fetched);
        }
    }
}
