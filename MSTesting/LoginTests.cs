using ManagementSystem.Controllers;
using ManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MSTesting
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void TestValidCredentials()
        {

            var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

            using (var context = new MyDbContext(options))
            {
                

                var controller = new LoginController(context);

                var user = new User
                {
                    Username = "Jquadri24",
                    Password = "JQAccount11"
                };
                context.User.Add(new User { Username= "Jquadri24", Password = HashPassword("JQAccount11") });
                context.SaveChanges();

                var result = controller.Index(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.AreEqual("Success", result.ViewName);
            }
        }

        [Test]
        public void TestInvalidCredentials_UserNotFound()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);

                var user = new User
                {
                    Username = "NonExistentUser",
                    Password = "SomePassword"
                };
                context.User.Add(new User { Username = "Jquadri24", Password = "JQAccount11" });
                context.SaveChanges();
                var result = controller.Index(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.IsNotNull(result.ViewData["ErrorMessage"]);
                Assert.AreEqual("Username does not exist.", result.ViewData["ErrorMessage"]);
            }
        }
        [Test]
        public void TestInvalidCredentials_IncorrectPassword()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);

                context.User.Add(new User { Username = "User", Password = HashPassword("CorrectPassword") });
                context.SaveChanges();

                var user = new User
                {
                    Username = "User",
                    Password = "IncorrectPassword"
                };

                var result = controller.Index(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.IsNotNull(result.ViewData["ErrorMessage"]);
                Assert.AreEqual("Incorrect Password.", result.ViewData["ErrorMessage"]);
            }
        }
        [Test]
        public void TestDuplicateUsername()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);

                context.User.Add(new User { Username = "DevProject", Password = "Password" });
                context.SaveChanges();

                var user = new User
                {
                    Username = "DevProject",
                    Password = "IncorrectPassword"
                };

                var result = controller.Create(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.IsNotNull(result.ViewData["ErrorMessage"]);
                Assert.AreEqual("Username already exists. Please use a different username.", result.ViewData["ErrorMessage"]);
            }
        }
        [Test]
        public void TestUsernameLength()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);


                var user = new User
                {
                    Username = "Userr",
                    Password = "Password"
                };

                var result = controller.Create(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.IsNotNull(result.ViewData["ErrorMessage"]);
                Assert.AreEqual("Username is too short. Your username must exceed 5 characters", result.ViewData["ErrorMessage"]);
            }
        }
        [Test]
        public void TestPasswordLength()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);

               

                var user = new User
                {
                    Username = "DevelopmentProject",
                    Password = "Tester"
                };

                var result = controller.Create(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.IsNotNull(result.ViewData["ErrorMessage"]);
                Assert.AreEqual("Password is too short. Your password must exceed 7 characters", result.ViewData["ErrorMessage"]);
            }
        }
        [Test]
        public void TestPasswordStrength()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);

                var user = new User
                {
                    Username = "DevelopmentProject",
                    Password = "tester123"
                };

                var result = controller.Create(user) as ViewResult;

                Assert.IsNotNull(result);
                Assert.IsNotNull(result.ViewData["ErrorMessage"]);
                Assert.AreEqual("Password does not meet all of the requirements. Please try again", result.ViewData["ErrorMessage"]);
            }
        }
        [Test]
        public void TestRedirectToLogin()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new MyDbContext(options))
            {
                var controller = new LoginController(context);

                context.User.Add(new User { Username = "User", Password = "CorrectPassword" });
                context.SaveChanges();

                var user = new User
                {
                    Username = "Testing",
                    Password = "Testing123"
                };


                var result = controller.Create(user);

                var redirectResult = (RedirectToActionResult)result;
                Assert.AreEqual("Index", redirectResult.ActionName);
                Assert.IsNotNull(result);
             
            }
        }

        private string HashPassword(string password)
        {

            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }

}
