const a = () => {
  files.map((file) => ({
    input: readFile(`prop-types/inside/${file}.js`),
    name: `prop-types/inside/${file}.js -> prop-types/outside/${file}.js`,
    output: readFile(`prop-types/outside/${file}.js`)
  }));
};
