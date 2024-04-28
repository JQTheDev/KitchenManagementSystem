using ManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;


namespace ManagementSystem.Controllers
{
    public class LoginController : Controller
    {
        private readonly MyDbContext _context;

        public LoginController(MyDbContext context) 
        {  
            _context = context; 
        }
        public IActionResult Index()
        {
            
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Index(User user)
        {
            var dbUser = _context.User.FirstOrDefault(u => u.Username == user.Username);
            if (dbUser != null && BCrypt.Net.BCrypt.Verify(user.Password, dbUser.Password))
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, dbUser.Username)
                };

                var claimsIdentity = new ClaimsIdentity(claims, "CookieAuth");
                var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

                await HttpContext.SignInAsync("CookieAuth", claimsPrincipal);

                return RedirectToAction("Index", "Home");
            }

            ViewBag.ErrorMessage = "Invalid username or password.";
            return View();
        }

        [HttpGet]
        public IActionResult Create()
        {

            return View();
        }
        
        [HttpPost]
        public IActionResult Create(User user)
        {
            
            if (_context.User.Any(x => x.Username == user.Username))
            {
                ViewBag.ErrorMessage = "Username already exists. Please use a different username.";
                
            }
            else
            {
                if (user.Password.Length < 8)
                {
                    ViewBag.ErrorMessage = "Password is too short. Your password must exceed 7 characters";
                    return View();
                }
                if (user.Username.Length < 6)
                {
                    ViewBag.ErrorMessage = "Username is too short. Your username must exceed 5 characters";
                    return View();
                }
                bool isDigit = false;
                bool isLower = false;
                bool isUpper = false;
                foreach(char letter in user.Password)
                {
                    if (char.IsDigit(letter)) 
                    {
                        isDigit = true;
                    }
                    else if (char.IsUpper(letter))
                    {
                        isUpper = true;
                    }
                    else if (char.IsLower(letter))
                    {
                        isLower = true;
                    }
                    if (isDigit && (isUpper && isLower))
                    {
                        user.Password = HashPassword(user.Password);
                        _context.Add(user);
                        _context.SaveChanges();
                        return RedirectToAction("Index");
                        
                    }
                }
                ViewBag.ErrorMessage = "Password does not meet all of the requirements. Please try again";
                
                
            }
            return View();
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Login");
        }

        private string HashPassword(string password)
        {
            
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
