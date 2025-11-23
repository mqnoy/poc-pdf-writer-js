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

const exampleWithNestedObjectData = async () => {
  const rows = [
    {
      number: 1,
      title: "example title number 1",
      description: "example long text",
      child: [],
    },
    {
      number: 2,
      title: "place holder",
      description: null,
      child: [
        {
          number: 2,
          title: "example child 2.1",
          description: "example long text",
        },
        {
          number: 2,
          title: "example child 2.2",
          description: "example long text",
        },
      ],
    },
    {
      number: 3,
      title: "example title number 3",
      description: "example long text",
      child: [],
    },
  ];

  return {
    title: "example",
    rows,
  };
};

module.exports = {
  loopTableData,
  exampleWithNestedObjectData,
};
