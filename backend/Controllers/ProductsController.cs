using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductsCRUD.Models.DTOs;
using ProductsCRUD.Models.Entities;
using ProductsCRUD.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsCRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            this.productRepository = productRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            try
            {
                var products = await productRepository.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving products.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            try
            {
                var product = await productRepository.GetByIdAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Product not found." });
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the product.", error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Product>> CreateProduct(ProductDTO product)
        {
            try
            {
                var newProduct = await productRepository.AddProductAsync(product);
                return CreatedAtAction(
                    nameof(GetProductById),
                    new { id = newProduct.Id },
                    new { message = "Product created successfully.", product = newProduct } // Add success message
                );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the product.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateProduct(int id, ProductDTO product)
        {
            try
            {
                var updatedProduct = await productRepository.GetByIdAsync(id);
                if (updatedProduct == null)
                {
                    return NotFound(new { message = "Product not found." });
                }

                await productRepository.UpdateProductAsync(id, product);
                return Ok(new { message = "Product updated successfully." }); // Add success message
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Product not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the product.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            try
            {
                await productRepository.DeleteProductAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Product not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting the product.", error = ex.Message });
            }
        }
    }
}