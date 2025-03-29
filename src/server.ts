function welcome(name: string) {
  console.log(`welcome ${name}`);
  const user = {
    name: "Rakesh",
  };
  const fname = user["name"];
  return name + fname;
}
welcome("Rakesh");
