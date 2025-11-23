const loopTableData = async () => {
  const data = {
    clients: [
      {
        first_name: "John",
        last_name: "Doe",
        phone: "+44546546454",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        phone: "+445476454",
      },
    ],
  };

  return data;
};

module.exports = {
  loopTableData,
};
