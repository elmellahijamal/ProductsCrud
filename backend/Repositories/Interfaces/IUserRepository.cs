using ProductsCRUD.Models.Entities;

namespace ProductsCRUD.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> RegisterAsync(User user);
        Task<User> GetUserByEmailAsync(string email);
    }
}
