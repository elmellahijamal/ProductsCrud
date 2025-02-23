using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductsCRUD.Models.Entities
{
        public class CartItem
        {
            [Key]
            public int Id { get; set; }

            [Required]
            public int UserId { get; set; }

            [Required]
            public int ProductId { get; set; }

            [Required]
            [Range(1, int.MaxValue)]
            public int Quantity { get; set; } = 1;

            [ForeignKey("UserId")]
            public User User { get; set; }

            [ForeignKey("ProductId")]
            public Product Product { get; set; }

        }
    }