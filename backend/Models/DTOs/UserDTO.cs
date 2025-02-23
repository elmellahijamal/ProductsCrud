namespace ProductsCRUD.Models.DTOs
{
    public class UserDTO
    {
        public required string Token { get; set; }
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
    }
}
