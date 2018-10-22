import jwt from 'jsonwebtoken';

class Authenticate {
  static isLoggedIn(req, res, next) {
    const token = req.headers.authorization ||
      req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          res.status(401)
            .send({
              success: false,
              message: 'Failed to Authenticate Token',
              error
            });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401)
        .send({
          success: false,
          message: 'Access denied, Authentication token does not exist'
        });
    }
  }
}
export default Authenticate;
