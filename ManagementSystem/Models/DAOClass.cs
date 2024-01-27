//using System.Data.SqlClient;

//namespace ManagementSystem.Models
//{
//    public class DAOClass
//    {
//        public readonly string _connectionString;

//        public DAOClass(string connectionString)
//        {
//            _connectionString = connectionString;
//        }

//        public bool IsUser(string username, string password)
//        {
//            string cmdText = "SELECT COUNT(*) FROM Credentials WHERE Username = @UserName and Password = @PassWord";
//            using(var connection = new SqlConnection(_connectionString))
//            {
//                connection.Open();
//                using (var command = new SqlCommand(cmdText, connection))
//                {
//                    command.Parameters.AddWithValue("@UserName", username);
//                    command.Parameters.AddWithValue("@PassWord", password);
//                    var result = (int)command.ExecuteScalar();

//                    if(result > 0)
//                    {
//                        return true;

//                    }
//                    else
//                    {
//                        return false;
//                    }
//                }
//            }
//        }
//    }
//}
