const bcrypt = require("bcrypt");

(async () => {
  const hash = await bcrypt.hash("1234", 10); // your real admin password
  console.log("Generated Hash:", hash);
})();
