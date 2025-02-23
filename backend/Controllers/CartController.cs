using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsCRUD.Data;
using ProductsCRUD.Models.DTOs;
using ProductsCRUD.Models.Entities;
using ProductsCRUD.Repositories.Interfaces;
using ProductsCRUD.Repositories.Services;
using System.Security.Claims;

namespace ProductsCRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICartService _cartService;

        public CartController(ApplicationDbContext context, ICartService cartService)
        {
            _context = context;
            _cartService = cartService;
        }

        // GET /api/cart - Récupérer les articles du panier de l'utilisateur connecté
        [HttpGet]
        public IActionResult GetCartItems()
        {
            // Ensure the user is authenticated
            if (User.Identity == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized("User not authenticated.");
            }

            // Debug: Print all claims to check if "id" is included
            var claims = User.Claims.ToList();
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            // Get the "id" claim
            var userIdClaim = User.FindFirst("id");  // Or ClaimTypes.NameIdentifier if you kept that name
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                return Unauthorized("User ID not found in token.");
            }

            // Try parsing the user ID, handle invalid format
            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Invalid user ID format.");
            }

            // Retrieve the cart items for the authenticated user
            var cartItems = _context.CartItems
            .Include(c => c.Product) // Eager-load the Product
            .Where(c => c.UserId == userId)
            .ToList();

            return Ok(cartItems);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDTO cartItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if the user is authenticated
                if (User.Identity == null || !User.Identity.IsAuthenticated)
                {
                    return Unauthorized("User not authenticated.");
                }

                // Use the custom claim type "id" for the user ID
                var userIdClaim = User.FindFirst("id");
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token.");
                }

                int userId = int.Parse(userIdClaim.Value);

                // Check if the item already exists in the cart
                var existingCartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == cartItemDto.ProductId);

                if (existingCartItem != null)
                {
                    // Item exists, update the quantity
                    existingCartItem.Quantity += cartItemDto.Quantity;
                    _context.CartItems.Update(existingCartItem);
                    await _context.SaveChangesAsync();

                    var updatedCartItemDto = new CartItemDTO
                    {
                        ProductId = existingCartItem.ProductId,
                        Quantity = existingCartItem.Quantity
                    };

                    return Ok(new { message = "Cart item quantity updated successfully.", cartItem = updatedCartItemDto });
                }
                else
                {
                    // Item doesn't exist, add it to the cart
                    var cartItem = await _cartService.AddToCart(userId, cartItemDto.ProductId, cartItemDto.Quantity);

                    var cartItemDtoReturn = new CartItemDTO
                    {
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                    };

                    return Ok(new { message = "Item added to cart successfully.", cartItem = cartItemDtoReturn });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while adding the item to the cart.", error = ex.Message });
            }
        }

        // DELETE /api/cart/{id} - Supprimer un article du panier
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            // Use the custom claim type "id" for the user ID
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                return Unauthorized("User ID not found in token.");
            }

            // Try parsing the user ID, handle invalid format
            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Invalid user ID format.");
            }

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (cartItem == null)
            {
                return NotFound(new { message = "Product not found in cart" });
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product deleted from cart" });
        }

    }
} 