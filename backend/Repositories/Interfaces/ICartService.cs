using ProductsCRUD.Models.Entities;

namespace ProductsCRUD.Repositories.Interfaces
{
    public interface ICartService
    {
        Task<List<CartItem>> GetCartItems(int userId);
        Task<CartItem> AddToCart(int userId, int productId, int quantity);
        Task RemoveFromCart(int userId, int cartItemId);
    }
}
