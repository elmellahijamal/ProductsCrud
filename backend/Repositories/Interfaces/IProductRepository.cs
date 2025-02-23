using ProductsCRUD.Models.DTOs;
using ProductsCRUD.Models.Entities;

namespace ProductsCRUD.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product> GetByIdAsync(int id);
        Task<Product> AddProductAsync(ProductDTO productDto);
        Task UpdateProductAsync(int id, ProductDTO productDto);
        Task DeleteProductAsync(int id);
    }
}
