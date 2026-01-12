const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/typescript/main.ts",
    games: "./src/typescript/modules/games.ts",
    ranking: "./src/typescript/ranking.ts",
    userManagement: "./src/typescript/userManagement.ts",
    users: "./src/typescript/users.ts",
    login: "./src/typescript/login.ts",
    navbar: "./src/typescript/navbar.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "typescript/[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
