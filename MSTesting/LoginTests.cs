using ManagementSystem.Controllers;
using ManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace MSTesting
{
    public class Tests
    {
        private MyDbContext _context;
        private LoginController _controller;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new MyDbContext(options);
            _controller = new LoginController(_context);
        }

        [Test]
        public async Task TestValidCredentials()
        {
            _context.User.Add(new User { Username = "Jquadri24", Password = HashPassword("JQAccount11") });
            _context.SaveChanges();

            var user = new User { Username = "Jquadri24", Password = "JQAccount11" };
            var result = await _controller.Index(user);

            Assert.IsInstanceOf<RedirectToActionResult>(result);
            var redirectResult = result as RedirectToActionResult;
            Assert.AreEqual("Home", redirectResult.ControllerName);
            Assert.AreEqual("Index", redirectResult.ActionName);
        }

        [Test]
        public async Task TestInvalidCredentials_UserNotFound()
        {
            var user = new User
            {
                Username = "NonExistentUser",
                Password = "SomePassword"
            };

            var result = await _controller.Index(user) as ViewResult;

            Assert.IsNotNull(result);
            Assert.IsTrue(result.ViewData["ErrorMessage"].ToString().Contains("Invalid username or password."));
        }

        [Test]
        public async Task TestInvalidCredentials_IncorrectPassword()
        {
            _context.User.Add(new User { Username = "User", Password = HashPassword("CorrectPassword") });
            _context.SaveChanges();

            var user = new User
            {
                Username = "User",
                Password = "IncorrectPassword"
            };

            var result = await _controller.Index(user) as ViewResult;

            Assert.IsNotNull(result);
            Assert.IsTrue(result.ViewData["ErrorMessage"].ToString().Contains("Invalid username or password."));
        }

        [Test]
        public void TestDuplicateUsername()
        {
            _context.User.Add(new User { Username = "DevProject", Password = "Password" });
            _context.SaveChanges();

            var user = new User
            {
                Username = "DevProject",
                Password = "IncorrectPassword"
            };

            var result = _controller.Create(user) as ViewResult;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ViewData["ErrorMessage"]);
            Assert.AreEqual("Username already exists. Please use a different username.", result.ViewData["ErrorMessage"]);
        }

        [Test]
        public void TestUsernameLength()
        {
            var user = new User
            {
                Username = "Userr",
                Password = "Password"
            };

            var result = _controller.Create(user) as ViewResult;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ViewData["ErrorMessage"]);
            Assert.AreEqual("Username is too short. Your username must exceed 5 characters", result.ViewData["ErrorMessage"]);
        }

        [Test]
        public void TestPasswordLength()
        {
            var user = new User
            {
                Username = "DevelopmentProject",
                Password = "Tester"
            };

            var result = _controller.Create(user) as ViewResult;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ViewData["ErrorMessage"]);
            Assert.AreEqual("Password is too short. Your password must exceed 7 characters", result.ViewData["ErrorMessage"]);
        }

        [Test]
        public void TestPasswordStrength()
        {
            var user = new User
            {
                Username = "DevelopmentProject",
                Password = "tester123"
            };

            var result = _controller.Create(user) as ViewResult;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ViewData["ErrorMessage"]);
            Assert.AreEqual("Password does not meet all of the requirements. Please try again", result.ViewData["ErrorMessage"]);
        }

        [Test]
        public void TestRedirectToLogin()
        {
            _context.User.Add(new User { Username = "User", Password = "CorrectPassword" });
            _context.SaveChanges();

            var user = new User
            {
                Username = "Testing",
                Password = "Testing123"
            };

            var result = _controller.Create(user);
            var redirectResult = (RedirectToActionResult)result;
            Assert.AreEqual("Index", redirectResult.ActionName);
            Assert.IsNotNull(result);
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
