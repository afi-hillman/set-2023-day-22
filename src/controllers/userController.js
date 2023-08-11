import { Op } from "sequelize";
import User from "../database/model/User";
import bcrypt from "bcrypt";
// const userController = async function (req, res) {
//   const body = req.body;
//   try {
//     // const user = await User.create({ ...body, profilePicture });
//     res.status(200).json({ body });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };

function createNewUser(req, res) {
  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    email: email,
    password: hashedPassword,
  })
    .then(function (data) {
      console.log(data);
      res
        .status(200)
        .json({ message: "a user registered!", data: data.dataValues });
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).json({ message: "an error occured!", data: error });
    });
}
async function login(req, res) {
  const { identifier, password } = req.body;
  const user = await User.findOne({
    attributes: ["username", "password", "id"],
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  });
  if (!user) {
    res.status(400).json({ message: "Wrong credentials input!" });
  }
  // compare hashed password
  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const { password, ...userDataWithoutPassword } = user.get();
      const serverRes = {
        message: "Login successful!",
        data: userDataWithoutPassword,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login unsuccessful",
        error: "Invalid credentials",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}
const userController = { createNewUser, login };

export default userController;
