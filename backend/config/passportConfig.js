require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const pool = require("./db");

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_BACKEND_URL
    : process.env.BACKEND_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: google_id, displayName: name, emails } = profile;
        const email = emails[0].value;

        // ✅ Check if user exists in DB
        const [existingUser] = await pool.execute(
          "SELECT * FROM users WHERE google_id = ?",
          [google_id]
        );

        // ✅ 'done': from passport, the completion of authentication
        if (existingUser.length > 0) {
          return done(null, existingUser[0]); // (no error, user obj.)
        }

        // ✅ Create new user into DB
        const [result] = await pool.execute(
          "INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)",
          [google_id, name, email]
        );

        // ✅ Retrieve newly created user
        const [newUser] = await pool.execute(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId]
        );
        return done(null, newUser[0]);
      } catch (error) {
        return done(error, null);
      } // (error occured, no user is returned)
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length > 0) {
      done(null, user[0]);
      return;
    } else {
      done(null, false);
    }
  } catch (error) {
    console.error("❌ Error in deserializeUser:", error);
    done(error, null);
  }
});

module.exports = passport;
