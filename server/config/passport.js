const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

// getDb: a function that returns the connected Mongo db instance.
module.exports = function configurePassport(getDb) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password', passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const db = req.app.locals.db;
          const user = await db.collection('users').findOne({
            username: (username || '').trim().toLowerCase(),
          });
          if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return done(null, false, { message: 'Invalid username or password.' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const db = getDb();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });
};
