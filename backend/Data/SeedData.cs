using Microsoft.EntityFrameworkCore;
using ProductsCRUD.Models.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsCRUD.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(ApplicationDbContext context)
        {
            try
            {
                if (await context.Products.AnyAsync()) return;

                var products = new List<Product>
                {
                    new Product { Name = "Product 1", Description = "Description of Product 1", Price = 23.99m },
                    new Product { Name = "Product 2", Description = "Description of Product 2", Price = 98.99m },
                    new Product { Name = "Product 3", Description = "Description of Product 3", Price = 10.00m },
                    new Product { Name = "Product 4", Description = "Description of Product 4", Price = 9.99m },
                    new Product { Name = "Product 5", Description = "Description of Product 5", Price = 24.99m }
                };

                await context.Products.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle seeding errors (e.g., log the error)
                Console.WriteLine($"Error seeding data: {ex.Message}");
            }
        }
    }
}
